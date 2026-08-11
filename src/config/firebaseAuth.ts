import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);

console.log("🔥 Firebase Authentication initialized successfully");
console.log("Firebase Auth App:", auth.app.options.projectId);