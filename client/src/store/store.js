import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/authSlice";
import sheetReducer from "./common-slices/sheetSlice";
import adminShowReducer from "./admin-slice/admin-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sheet: sheetReducer,
    adminShows: adminShowReducer,
  },
});

export default store;
