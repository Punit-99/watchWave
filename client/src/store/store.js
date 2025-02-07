import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/authSlice";
import sheetReducer from "./common-slices/sheetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sheet: sheetReducer,
  },
});

export default store;
