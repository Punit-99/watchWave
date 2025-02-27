import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/admin/shows";
export const uploadFile = createAsyncThunk(
  "upload/file",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Determine file type (image or video)
      const fileType = file.type.startsWith("video") ? "video" : "image";
      formData.append("type", fileType);

      // Send to backend instead of Cloudinary
      const response = await axios.post(`${BASE_URL}/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Extract response data
      const { result } = response.data;
      const { public_id, resource_type, secure_url } = result;

      return { public_id, resource_type, secure_url };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: { isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default uploadSlice.reducer;
