import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { RegistrationFormValues } from "@/utils/types/Apptypes";
import RegistrationComp from "@/components/common/RegistrationComp/RegistrationComp";
import {
  registerUser,
  signInWithGoogle,
  toAppUser,
} from "@/services/authService";
import { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/reducers";

const RegistrationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleRegister = async (values: RegistrationFormValues) => {
    if (isRegisterLoading) return;
    setIsRegisterLoading(true);
    try {
      const user = await registerUser(
        values.fullName,
        values.email,
        values.password,
      );
       dispatch(setUser(await toAppUser(user)));
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Registration error:", error);
      let message = "Unable to create your account.";
      switch (error?.code) {
        case "auth/email-already-in-use":
          message = "An account already exists with this email.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          message = "Password is too weak.";
          break;
        case "auth/network-request-failed":
          message = "Please check your internet connection.";
          break;
      }
      Alert.alert("Registration failed", message);
    } finally {
      setIsRegisterLoading(false); // NEW
    }
  };

  const handleLoginPress = () => {
    router.replace("/(StackScreens)/LoginScreen");
  };

  const handleGooglePress = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
       dispatch(setUser(await toAppUser(user)));
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Google Sign-In error:", error);

      let message = "Unable to sign in with Google.";

      if (error?.code === "auth/network-request-failed") {
        message = "Please check your internet connection.";
      }

      Alert.alert("Google Sign-In failed", message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <RegistrationComp
      onRegister={handleRegister}
      onLoginPress={handleLoginPress}
      onGooglePress={handleGooglePress}
      isGoogleLoading={isGoogleLoading}
      isRegisterLoading={isRegisterLoading} 
    />
  );
};

export default RegistrationScreen;