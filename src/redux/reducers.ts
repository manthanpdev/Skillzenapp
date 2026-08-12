import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  fetchCategories,
  fetchTopicsByCategory,
  fetchLessonsByTopic,
} from "./actions";
import { GlobalState, UserData, TopicProgress } from "../utils/types/Apptypes";

const initialState: GlobalState = {
  currentUser: null,
  getStartedCompleted: false,
  isLoading: false,
  isTopicsLoading: false,
  isLessonsLoading: false,
  error: null,

  categories: [],
  topics: [],
  lessons: [],

  selectedCategoryId: null,
  selectedTopicId: null,

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

    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthResolved = true;
    },

    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
    },

    setSelectedTopic: (state, action: PayloadAction<string>) => {
      state.selectedTopicId = action.payload;
    },
    updateTopicProgress: (state, action: PayloadAction<TopicProgress>) => {
      if (!state.currentUser) {
        return;
      }
      const progress = action.payload;
      if (!state.currentUser.userData) {
        state.currentUser.userData = [];
      }
      const existingIndex = state.currentUser.userData.findIndex(
        (item) => item.topicId === progress.topicId,
      );
      if (existingIndex === -1) {
        state.currentUser.userData.push(progress);
      } else {
        state.currentUser.userData[existingIndex] = progress;
      }
    },
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
        state.isLoading = false;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Unable to fetch categories";
      });

    builder
      .addCase(fetchTopicsByCategory.pending, (state) => {
        state.isTopicsLoading = true;
      })
      .addCase(fetchTopicsByCategory.fulfilled, (state, action) => {
        state.topics = action.payload;
        state.isTopicsLoading = false;
      })
      .addCase(fetchTopicsByCategory.rejected, (state, action) => {
        state.isTopicsLoading = false;
        state.error = action.error.message || "Unable to fetch topics";
      });

    // Lessons
    builder
      .addCase(fetchLessonsByTopic.pending, (state) => {
        state.isLessonsLoading = true;
      })
      .addCase(fetchLessonsByTopic.fulfilled, (state, action) => {
        state.lessons = action.payload;
        state.isLessonsLoading = false;
      })
      .addCase(fetchLessonsByTopic.rejected, (state, action) => {
        state.isLessonsLoading = false;
        state.error = action.error.message || "Unable to fetch lessons";
      });
  },
});

export const {
  clearError,
  clearUser,
  setUser,
  setSelectedCategory,
  setSelectedTopic,
  updateTopicProgress,
} = globalSlice.actions;

export default globalSlice.reducer;
