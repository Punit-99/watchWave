import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/admin/shows";

// ⬆️ Upload File Thunk
const uploadFile = createAsyncThunk(
  "upload/file",
  async ({ file }, { rejectWithValue }) => {
    try {
      const fullMimeType = file.type || ""; // fallback to empty string
      const extension = file.name.split(".").pop().toLowerCase();

      let type;
      if (extension === "srt" || extension === "vtt") {
        type = "subtitle";
      } else {
        const majorType = fullMimeType.split("/")[0];
        type = fullMimeType === "text/vtt" ? "subtitle" : majorType;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type); // send this explicitly

      const response = await axios.post(`${BASE_URL}/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { result } = response.data;
      const { public_id, resource_type, secure_url } = result;

      return { public_id, resource_type, secure_url };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

// ⬇️ Delete File Thunk
const deleteFile = createAsyncThunk(
  "upload/deleteFile",
  async ({ public_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/delete/upload-file`, {
        public_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

// ⬅️ Upload Slice
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
      })

      // Handle deleteFile (optional loading state if needed)
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default uploadSlice.reducer;
export { uploadFile, deleteFile };
