import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/authSlice";
import uploadReducer from "./admin-slice/upload-slice";
import adminShowReducer from "./admin-slice/admin-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminShows: adminShowReducer,
    upload: uploadReducer,
  },
});

export default store;
