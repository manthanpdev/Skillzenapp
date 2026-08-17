import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  fetchCategories,
  fetchTopicsByCategory,
  fetchLessonsByTopic,
  logOutUser,
  updateTopicProgress,
  updateLastReadTopic,
} from "./actions";
import { GlobalState, UserData } from "../utils/types/Apptypes";

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
      const incoming = action.payload;
      state.currentUser = {
        ...incoming,
        lastReadTopic: incoming.lastReadTopic ?? state.currentUser?.lastReadTopic ?? null,
      };
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
  },

  extraReducers: (builder) => {
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

    builder
      .addCase(logOutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthResolved = true;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.error = action.error.message || "Unable to logout";
      });

    builder
      .addCase(updateTopicProgress.pending, (state) => {
        state.error = null;
      })
     .addCase(updateTopicProgress.fulfilled, (state, action) => {
  if (state.currentUser) {
    state.currentUser.userdata = action.payload;
  }
})
      .addCase(updateTopicProgress.rejected, (state, action) => {
        state.error = action.error.message || "Unable to update progress";
      });

    builder
      .addCase(updateLastReadTopic.pending, (state) => {
        state.error = null;
      })
      .addCase(updateLastReadTopic.fulfilled, (state, action) => {
        if (state.currentUser) {
          state.currentUser.lastReadTopic = action.payload;
        }
      })
      .addCase(updateLastReadTopic.rejected, (state, action) => {
        state.error = action.error.message || "Unable to update last read topic";
      });
  },
});

export const {
  clearError,
  clearUser,
  setUser,
  setSelectedCategory,
  setSelectedTopic,
} = globalSlice.actions;

export default globalSlice.reducer;