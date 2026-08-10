import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

import { signInWithGoogle } from "../services/authService";

const GoogleTest = () => {
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();

      console.log("🔥 Google Sign-In successful");
      console.log("User UID:", user.uid);
      console.log("User Email:", user.email);
      console.log("User Name:", user.displayName);

      Alert.alert(
        "Google Sign-In Successful",
        `Email: ${user.email}\nUID: ${user.uid}`,
      );
    } catch (error: any) {
      console.log("❌ Google Sign-In failed");
      console.log(error);

      Alert.alert(
        "Google Sign-In Failed",
        error?.message ?? "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In Test</Text>

      <Button title="Continue with Google" onPress={handleGoogleSignIn} />
    </View>
  );
};

export default GoogleTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
});
