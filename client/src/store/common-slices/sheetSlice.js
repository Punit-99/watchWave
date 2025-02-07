// src/redux/sheetSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false, // The initial state of the Sheet (closed by default)
};

const sheetSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    openSheet: (state) => {
      state.isOpen = true;
    },
    closeSheet: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openSheet, closeSheet } = sheetSlice.actions;
export default sheetSlice.reducer;
