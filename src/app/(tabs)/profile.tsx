import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import ProfileComp from "@/components/common/Profile/ProfileComp";

import type { AppDispatch, RootState } from "@/redux/store";
import { logOutUser } from "@/redux/actions";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentUser = useSelector(
    (state: RootState) => state.global.currentUser,
  );

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Camera permission is required to take a photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const photoUri = result.assets[0].uri;

    try {
      // await dispatch(updateProfilePhoto(photoUri)).unwrap();

      setIsPhotoModalVisible(false);
    } catch (error) {
      console.log("Camera photo error:", error);

      Alert.alert("Photo update failed", "Unable to update profile photo.");
    }
  };

  const handleSelectFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Gallery permission is required to select a photo.",
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const photoUri = result.assets[0].uri;

    try {
      // await dispatch(updateProfilePhoto(photoUri)).unwrap();

      setIsPhotoModalVisible(false);
    } catch (error) {
      console.log("Gallery photo error:", error);

      Alert.alert("Photo update failed", "Unable to update profile photo.");
    }
  };

  const handleDeletePhoto = async () => {
    try {
      // await dispatch(updateProfilePhoto(null)).unwrap();

      setIsPhotoModalVisible(false);
    } catch (error) {
      console.log("Delete photo error:", error);

      Alert.alert("Delete failed", "Unable to delete profile photo.");
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // NEW guard
    setIsLoggingOut(true); // NEW
    try {
      await dispatch(logOutUser()).unwrap();
      router.replace("/(StackScreens)/LoginScreen");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Logout failed", "Unable to logout.");
    } finally {
      setIsLoggingOut(false); // NEW
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <ProfileComp
      currentUser={currentUser}
      isPhotoModalVisible={isPhotoModalVisible}
      onOpenPhotoModal={() => setIsPhotoModalVisible(true)}
      onClosePhotoModal={() => setIsPhotoModalVisible(false)}
      onTakePhoto={handleTakePhoto}
      onSelectFromGallery={handleSelectFromGallery}
      onDeletePhoto={handleDeletePhoto}
      onLogout={handleLogout}
    
    />
  );
};

export default Profile;