import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";

export const registerUserApi = async (formData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, formData, {
    withCredentials: true,
  });
  return response.data;
};

export const loginUserApi = async (formData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
    withCredentials: true,
  });
  return response.data;
};

export const logoutUserApi = async () => {
  const response = await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const checkAuthApi = async () => {
  const response = await axios.get(`${BASE_URL}/auth/check-auth`, {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data;
};
