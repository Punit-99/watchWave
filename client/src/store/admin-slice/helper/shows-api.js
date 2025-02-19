// src/store/admin/shows-api.js

import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/admin/shows";

// Add new show
export const addNewShowAPI = async (formData) => {
  const result = await axios.post(`${BASE_URL}/add-show`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result?.data;
};

// Edit show
export const editShowAPI = async (id, formData) => {
  const result = await axios.put(`${BASE_URL}/edit/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result?.data;
};

// Delete show
export const deleteShowAPI = async (id) => {
  const result = await axios.delete(`${BASE_URL}/delete-show/${id}`);
  return result?.data;
};

// Fetch all shows
export const fetchAllShowsAPI = async () => {
  const result = await axios.get(`${BASE_URL}/get-show`);
  return result?.data;
};
