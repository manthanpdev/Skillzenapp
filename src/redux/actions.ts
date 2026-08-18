import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore";
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

export const fetchTopicById = createAsyncThunk(
  "topics/fetchById",
  async (topicId: string) => {
    const topicRef = doc(db, "topics", topicId);
    const topicSnap = await getDoc(topicRef);

    if (!topicSnap.exists()) {
      throw new Error("Topic not found");
    }

    return { id: topicSnap.id, ...topicSnap.data() } as Topic;
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
      topickTitle: string;
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

    const toMillis = (value: any): number => {
      if (typeof value === "number") return value;
      if (value?.toMillis) return value.toMillis();
      if (value?.seconds) return value.seconds * 1000;
      return Date.now();
    };

    const existingUserData: TopicProgress[] = rawUserData.map((entry) => ({
      ...entry,
      startedAt: toMillis(entry.startedAt),
      updatedAt: toMillis(entry.updatedAt),
    }));

    const existingIndex = existingUserData.findIndex(
      (entry) =>
        entry.topicTitle === payload.topickTitle &&
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
          topicTitle: payload.topickTitle,
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

    return updatedUserData;
  },
);


export const updateLastReadTopic = createAsyncThunk(
  "global/updateLastReadTopic",
  async (
    payload: {
      topicId: string;
      topicTitle: string;
      lastLessonIndex: number;
      lessonTitle?:string
    },
    { getState },
  ) => {
    const state = getState() as RootState;
    const currentUser = state.global.currentUser;

    if (!currentUser) {
      throw new Error("User not found");
    }

    const userRef = doc(db, "users", currentUser.uid);

    const lastReadTopic = {
      topicId: payload.topicId,
      topicTitle: payload.topicTitle,
      lastLessonIndex: payload.lastLessonIndex,
      updatedAt: Date.now(),
      lessonTitle:payload.lessonTitle
    };

    await setDoc(
      userRef,
      { lastReadTopic, updatedAt: serverTimestamp() },
      { merge: true },
    );

    return lastReadTopic;
  },
);