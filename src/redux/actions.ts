import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

import { Category, Topic, Lesson } from "../utils/types/Apptypes";
import { logOutCurrentUser } from "@/services/authService";

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const data = await getDocs(collection(db, "categories"));

    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  },
);

export const fetchTopics = createAsyncThunk("topics/fetch", async () => {
  const data = await getDocs(collection(db, "topics"));

  return data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Topic[];
});

export const fetchLessons = createAsyncThunk("lessons/fetch", async () => {
  const data = await getDocs(collection(db, "lessons"));

  return data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Lesson[];
});


export const logOutUser = createAsyncThunk("user/logout", async () => {
  await logOutCurrentUser()
})