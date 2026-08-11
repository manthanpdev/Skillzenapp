import { createAsyncThunk } from "@reduxjs/toolkit";


export const GetCategories = createAsyncThunk("get/categories", async () => {
  try {
    return require("../assets/Data/categories.json");
  } catch (error) {
    console.log("Error to fetch Categories");
    return [];
  }
});