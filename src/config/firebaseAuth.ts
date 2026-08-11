import { initializeAuth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "./firebaseConfig";

const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

console.log("🔥 Firebase Authentication initialized successfully");
console.log("Firebase Auth App:", auth.app.options.projectId);