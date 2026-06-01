import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Never refresh refresh endpoint
    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();

      window.location.replace("/auth");

      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
      useAuthStore.getState().logout();

      window.location.replace("/auth");

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          },
        );
      }

      await refreshPromise;

      refreshPromise = null;

      return api(originalRequest);
    } catch (err) {
      refreshPromise = null;

      useAuthStore.getState().logout();

      window.location.replace("/auth");

      return Promise.reject(err);
    }
  },
);

export default api;
