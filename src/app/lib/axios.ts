import axios from "axios";
import { useAuthStore } from "./store/auth.store";
import { queryClient } from "@/lib/query-client";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;
let isLoggingOut = false;

const noRefreshEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/me",
];

function forceLogout() {
  if (isLoggingOut) return;

  isLoggingOut = true;

  queryClient.removeQueries({
    queryKey: ["me"],
  });

  useAuthStore.getState().logout();

  window.location.replace("/auth");
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // never refresh these endpoints
    if (noRefreshEndpoints.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    // refresh endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    // already retried once
    if (originalRequest._retry) {
      forceLogout();
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

      forceLogout();

      return Promise.reject(err);
    }
  },
);

export default api;
