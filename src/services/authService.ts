import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  signInWithEmailAndPassword,
  User
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth } from "../config/firebaseAuth";
import { db } from "@/config/firebaseConfig";
import { UserData } from "@/utils/types/Apptypes";

// ================================
// Email / Password Registration
// ================================


export const toAppUser = (user: User): any => ({
  uid: user.uid,
  fullName: user.displayName,
  photoURL: user.photoURL,
  email: user.email
});

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;


  // Save user's name in Firebase Authentication
  await updateProfile(user, {
    displayName: fullName,
  });

  // Save additional user information in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName,
    email: user.email,
    photoURL: user.photoURL ?? null,
    provider: "password",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
};


export const loginUser = async (
  email: string,
  password: string,
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

// ================================
// Google Sign-In Configuration
// ================================

GoogleSignin.configure({
  webClientId:
    "92988697490-m4t3vvo422m001hgtj8p61gph63588tu.apps.googleusercontent.com",
});

// ================================
// Google Sign-In
// ================================

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  // Clear the previous Google Sign-In session
  await GoogleSignin.signOut();
  // Now show the Google account chooser
  const response = await GoogleSignin.signIn();
  if (response.type !== "success") {
    throw new Error("Google Sign-In was cancelled");
  }
  const { idToken } = response.data;
  if (!idToken) {
    throw new Error("Google ID token was not received");
  }
  const googleCredential =
    GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(
    auth,
    googleCredential,
  );
  const user = userCredential.user;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      fullName: user.displayName ?? "",
      email: user.email,
      photoURL: user.photoURL ?? null,
      provider: "google",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return user;
};