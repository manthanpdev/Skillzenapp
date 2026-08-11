import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { User } from "@/utils/types/Apptypes";
import ProfileComp from "@/components/common/ProfileComp";

const Profile = () => {
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  const currentUser: User = {
    id: "1",
    fullName: "Manthan Patel",
    email: "manthan@gmail.com",
    password: "",
    photo: "",
    googlePhoto: "",
    loginType: "email",
    userData: [],
  };
  return (
    <ProfileComp
      currentUser={currentUser}
      isPhotoModalVisible={isPhotoModalVisible}
      onOpenPhotoModal={() => setIsPhotoModalVisible(true)}
      onClosePhotoModal={() => setIsPhotoModalVisible(false)}
      onTakePhoto={() => console.log("Take Photo")}
      onSelectFromGallery={() => console.log("Gallery")}
      onDeletePhoto={() => console.log("Delete")}
      onLogout={() => {
        router.replace("/(StackScreens)/LoginScreen");
      }}
    />
  );
};

export default Profile;

const styles = StyleSheet.create({});
