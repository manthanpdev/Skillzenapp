import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import CustomTextInput from "../ReusableComp/CustomTextInput";
import AppButton from "../ReusableComp/AppButton";
import { LoginErrorsProps } from "@/utils/types/Apptypes";
import { theme } from "@/utils/theme/Theme";
import { GoogleIcon } from "../../assets/Svg/SvgIcons";
import { loginUser, signInWithGoogle, toAppUser } from "@/services/authService";
import type { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/reducers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState("");
  const [email, setemail] = useState("");
  const [errors, setErrors] = useState<LoginErrorsProps>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const validate = (): boolean => {
    const newErrors: LoginErrorsProps = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (text: string) => {
    setemail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      dispatch(setUser(await toAppUser(user)));
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Google Sign-In error:", error);
      let message = "Unable to sign in with Google.";
      switch (error?.code) {
        case "auth/network-request-failed":
          message = "Please check your internet connection.";
          break;
        case "auth/account-exists-with-different-credential":
          message =
            "An account already exists with a different sign-in method.";
          break;
        case "auth/invalid-credential":
          message = "Google sign-in credentials are invalid.";
          break;
      }
      Alert.alert("Google Sign-In failed", message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (isSigningIn) return;
    if (!validate()) {
      return;
    }
    setIsSigningIn(true);
    try {
      const user = await loginUser(email.trim().toLowerCase(), password);
      dispatch(setUser(await toAppUser(user)));
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Login error:", error);
      let message = "Unable to login.";
      switch (error?.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;
        case "auth/network-request-failed":
          message = "Please check your internet connection.";
          break;
      }
      Alert.alert("Login failed", message);
    } finally {
      setIsSigningIn(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        <Text style={styles.welcome}>Welcome Back!</Text>
        <Text style={styles.learinig}>Sign in to continue learinig</Text>

        <CustomTextInput
          label="email"
          placeholder="Enter your email"
          value={email}
          onChangeText={handleEmailChange}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <CustomTextInput
          label="Password"
          placeholder="Enter your password"
          isPassword
          value={password}
          onChangeText={handlePasswordChange}
          error={errors.password}
        />
        {/* <View style={styles.forgotePassword}>
          <AppButton
            backgroundColor="#ffffff00"
            title="Forgot Password ?"
            textColor={theme.colors.muted}
            fontSize={13}
            fontweight="300"
            style={styles.forgotePassword}
            height={20}
          />
        </View> */}
        <AppButton
          title="Sign In"
          loadingTitle="Signing in..."
          loading={isSigningIn}
          height={46}
          fontSize={15}
          onPress={handleSignIn}
        />
        <View style={styles.box}>
          <View style={styles.line}></View>
          <Text style={styles.or}>or continue with</Text>
          <View style={styles.line}></View>
        </View>
        <View style={styles.box2}>
          <AppButton
            title="Continue with google"
            loadingTitle="Signing in..."
            loading={isGoogleLoading}
            height={46}
            backgroundColor={theme.colors.surface}
            borderwidth={1}
            bordercolor={theme.colors.border}
            textColor={theme.colors.text}
            fontweight="600"
            fontSize={14}
            borderRadius={10}
            icon={<GoogleIcon />}
            iconPosition="left"
            onPress={handleGoogleSignIn}
          />
        </View>
        <View style={styles.box3}>
          <Text style={styles.donacount}>Don't have an acount? </Text>
          <AppButton
            backgroundColor="#df1f1f00"
            title="Registration"
            textColor={theme.colors.primary}
            fontSize={13}
            fontweight="700"
            height={20}
            width="auto"
            onPress={() => router.replace("/RegistrationScreen")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginComponent;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    // alignItems: "center",
  },
  welcome: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 2,
  },

  donacount: {
    textAlign: "center",
    color: theme.colors.muted,
  },

  learinig: {
    textAlign: "center",
    color: theme.colors.muted,
    marginBottom: 23,
    marginTop: 6,
  },
  forgotePassword: {
    marginStart: "auto",
    marginBottom: 10,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  or: {
    color: theme.colors.muted,
  },
  line: {
    height: 1,
    backgroundColor: theme.colors.divider,
    width: "33%",
  },
  box2: {
    alignItems: "center",
    justifyContent: "center",
  },
  box3: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
});
