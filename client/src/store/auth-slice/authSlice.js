/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  registerUserApi,
  loginUserApi,
  logoutUserApi,
  checkAuthApi,
} from "./helper/authApi";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    return await registerUserApi(formData);
  }
);

// Login User
export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  return await loginUserApi(formData);
});

// Logout User
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  return await logoutUserApi();
});

// Check Auth
export const checkAuth = createAsyncThunk("auth/checkauth", async () => {
  return await checkAuthApi();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // CheckAuth
    builder
      .addCase(checkAuth.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
