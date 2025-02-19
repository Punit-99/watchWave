// src/store/admin/shows-slice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addNewShowAPI,
  editShowAPI,
  deleteShowAPI,
  fetchAllShowsAPI,
} from "./helper/shows-api"; // Import the API functions

const initialState = {
  isLoading: false,
  showList: [],
};

// Add new show
export const addNewShow = createAsyncThunk(
  "/shows/addNewShow",
  async (formData) => await addNewShowAPI(formData)
);

// Edit show
export const editShow = createAsyncThunk(
  "/shows/editShow",
  async ({ id, formData }) => await editShowAPI(id, formData)
);

// Delete show
export const deleteShow = createAsyncThunk(
  "/shows/deleteShow",
  async (id) => await deleteShowAPI(id)
);

// Fetch all shows
export const fetchAllShows = createAsyncThunk(
  "/shows/fetchAllShows",
  async () => await fetchAllShowsAPI()
);

// Slice
const showsSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllShows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showList = action.payload.data;
      })
      .addCase(fetchAllShows.rejected, (state) => {
        state.isLoading = false;
        state.showList = [];
      });
  },
});

export default showsSlice.reducer;
