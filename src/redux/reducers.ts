import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchCategories, fetchTopics, fetchLessons, logOutUser } from "./actions";

import { GlobalState, UserData } from "../utils/types/Apptypes";

const initialState: GlobalState = {
  currentUser: null,
  getStartedCompleted: false,
  isLoading: false,
  error: null,

  categories: [],
  topics: [],
  lessons: [],

  selectedCatogery: [],
  selectLessons: [],

  isAuthResolved: false,
};

const globalSlice = createSlice({
  name: "global",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action: PayloadAction<UserData>) => {
      state.currentUser = action.payload;
      state.isAuthResolved = true;
    },

    // clearUser: (state) => {
    //   state.currentUser = null;
    //   state.isAuthResolved = true;
    // },
  },

  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Unable to fetch categories";
      });

    // Topics
    builder.addCase(fetchTopics.fulfilled, (state, action) => {
      state.topics = action.payload;
    });

    // Lessons
    builder.addCase(fetchLessons.fulfilled, (state, action) => {
      state.lessons = action.payload;
      state.isLoading = false;
    });

    // logout Current User

    builder.addCase(logOutUser.fulfilled, (state) => {
      state.currentUser = null
      state.isAuthResolved = true
    })

    builder.addCase(logOutUser.rejected, (state, action) => {
      state.error = action.error.message || "Unable to logout";
    })
  },
});

export const { clearError, setUser } = globalSlice.actions;

export default globalSlice.reducer;
