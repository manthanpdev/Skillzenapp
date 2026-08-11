import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjy1Q1uaF0trbGdk4wOyBqJwAJatuKAZg",
  authDomain: "skillzenapp-a9e1f.firebaseapp.com",
  projectId: "skillzenapp-a9e1f",
  storageBucket: "skillzenapp-a9e1f.firebasestorage.app",
  messagingSenderId: "92988697490",
  appId: "1:92988697490:web:1fe9f1eaef7006e55a6f4b",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const db = getFirestore(app);

console.log("🔥 Firebase initialized successfully");
console.log("Firebase Project ID:", app.options.projectId);