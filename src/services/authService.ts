import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../config/firebaseAuth";

export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

GoogleSignin.configure({
  webClientId:
    "92988697490-m4t3vvo422m001hgtj8p61gph63588tu.apps.googleusercontent.com",
});

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
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
  return userCredential.user;
};
