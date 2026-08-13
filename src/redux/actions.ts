import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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

export const fetchTopicsByCategory = createAsyncThunk(
  "topics/fetchByCategory",
  async (categoryId: string) => {
    const topicsQuery = query(
      collection(db, "topics"),
      where("categoryId", "==", categoryId),
      orderBy("order", "asc"),
    );

    const data = await getDocs(topicsQuery);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Topic[];
  },
);

export const fetchLessonsByTopic = createAsyncThunk(
  "lessons/fetchByTopic",
  async (topicId: string) => {
    const lessonsQuery = query(
      collection(db, "lessons"),
      where("topicId", "==", topicId),
    );

    const data = await getDocs(lessonsQuery);
    return data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];
  },
);

export const logOutUser = createAsyncThunk("user/logout", async () => {
  await logOutCurrentUser()
})