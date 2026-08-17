import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  signInWithEmailAndPassword,
  User,
  signOut
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth } from "../config/firebaseAuth";
import { db } from "@/config/firebaseConfig";
import { UserData } from "@/utils/types/Apptypes";

// ================================
// Email / Password Registration
// ================================

export const toAppUser = async (user: User): Promise<UserData> => {
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.exists() ? snap.data() : {};

  const toMillis = (value: any): number => {
    if (typeof value === "number") return value;
    if (value?.toMillis) return value.toMillis();
    if (value?.seconds) return value.seconds * 1000;
    return Date.now();
  };

  const userdata = (data.userdata ?? []).map((entry: any) => ({
    ...entry,
    startedAt: toMillis(entry.startedAt),
    updatedAt: toMillis(entry.updatedAt),
  }));

  return {
    id: user.uid,
    uid: user.uid,
    fullName: user.displayName,
    photoURL: user.photoURL,
    email: user.email!,
    loginType: data.provider === "google" ? "google" : "email",
    userdata,
    lastReadTopic: data.lastReadTopic
      ? { ...data.lastReadTopic, updatedAt: toMillis(data.lastReadTopic.updatedAt) }
      : null,
  };
};

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
    userdata: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};


// Google Sign-In Configuration

GoogleSignin.configure({
  webClientId:
    "92988697490-m4t3vvo422m001hgtj8p61gph63588tu.apps.googleusercontent.com",
});


// Google Sign-In

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signOut();
  const response = await GoogleSignin.signIn();
  if (response.type !== "success") {
    throw new Error("Google Sign-In was cancelled");
  }
  const { idToken } = response.data;
  if (!idToken) {
    throw new Error("Google ID token was not received");
  }
  const googleCredential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, googleCredential);
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

// user Logout

export const logOutCurrentUser = async () => {
  try {
    const isUserLOgin = GoogleSignin.getCurrentUser()
    if (isUserLOgin) {
      await GoogleSignin.signOut()
    }
  } catch (error) {
    console.log("signOut Fail", error);
  }
  return signOut(auth)
}