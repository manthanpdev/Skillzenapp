import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

import { Category, Topic, Lesson, TopicProgress } from "../utils/types/Apptypes";
import { logOutCurrentUser } from "@/services/authService";
import { RootState } from "./store";

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


// Store user Progress
export const updateTopicProgress = createAsyncThunk(
  "global/updateTopicProgress",
  async (
    payload: {
      categoryTitle: string;
      topicId: string;
      lastLessonIndex: number;
      completed: boolean;
    },
    { getState },
  ) => {
    const state = getState() as RootState;
    const currentUser = state.global.currentUser;

    if (!currentUser) {
      throw new Error("User not found");
    }

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    const rawUserData: any[] = userSnap.exists()
      ? (userSnap.data().userdata ?? [])
      : [];

    // Convert any leftover Firestore Timestamps (from old buggy writes)
    // into plain epoch millis so Redux never sees a class instance.
    const toMillis = (value: any): number => {
      if (typeof value === "number") return value;
      if (value?.toMillis) return value.toMillis(); // Firestore Timestamp
      if (value?.seconds) return value.seconds * 1000; // plain {seconds,nanoseconds}
      return Date.now();
    };

    const existingUserData: TopicProgress[] = rawUserData.map((entry) => ({
      ...entry,
      startedAt: toMillis(entry.startedAt),
      updatedAt: toMillis(entry.updatedAt),
    }));

    const existingIndex = existingUserData.findIndex(
      (entry) =>
        entry.categoryTitle === payload.categoryTitle &&
        entry.topicId === payload.topicId,
    );

    let updatedUserData: TopicProgress[];

    if (existingIndex !== -1) {
      updatedUserData = [...existingUserData];
      updatedUserData[existingIndex] = {
        ...updatedUserData[existingIndex],
        lastLessonIndex: payload.lastLessonIndex,
        completed: payload.completed,
        updatedAt: Date.now(),
      };
    } else {
      updatedUserData = [
        ...existingUserData,
        {
          categoryTitle: payload.categoryTitle,
          topicId: payload.topicId,
          lastLessonIndex: payload.lastLessonIndex,
          completed: payload.completed,
          startedAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
    }

    await setDoc(
      userRef,
      { userdata: updatedUserData, updatedAt: serverTimestamp() },
      { merge: true },
    );

    return { ...currentUser, userdata: updatedUserData };
  },
);