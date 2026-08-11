import { createSlice } from "@reduxjs/toolkit";

import {
  GetCategories,
} from "./actions";
import { GlobalState } from "../utils/types/Apptypes";


const initialState: GlobalState = {
  currentUser: null,
  getStartedCompleted: false,
  isLoading: false,
  error: null,
  categories: [],
  selectedCatogery: [],
  selectLessons: [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // getting catogeries
      .addCase(GetCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(GetCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })

      .addCase(GetCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Unable to fetch categories";
      })

  },
});

export const { clearError } = globalSlice.actions;

export default globalSlice.reducer;
