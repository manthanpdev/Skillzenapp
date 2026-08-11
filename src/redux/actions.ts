import { StoreData } from "@/services/Asyncstorage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const GET_STARTED_KEY = "getStartedCompleted";

export const GetCategories = createAsyncThunk("get/categories", async () => {
  try {
    return require("../assets/Data/categories.json");
  } catch (error) {
    console.log("Error to fetch Categories");
    return [];
  }
});

// Save that Get Started has been completed
export const completeGetStarted = createAsyncThunk(
  "global/completeGetStarted",
  async () => {
    await StoreData(GET_STARTED_KEY, true);

    return true;
  },
);
