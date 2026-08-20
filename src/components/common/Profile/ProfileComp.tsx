import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/utils/theme/Theme";
import type { ProfileCompProps } from "@/utils/types/Apptypes";
import { LogoutIcon } from "../../../assets/Svg/SvgIcons";
import AppButton from "../../ReusableComp/AppButton";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileMenu from "./ProfileMenu";
import ChangePhotoModal from "./ChangePhotoModal";
import LogoutConfirmModal from "./LogoutConfirmModal";

const ProfileComp = ({
  currentUser,
  isPhotoModalVisible,
  onOpenPhotoModal,
  onClosePhotoModal,
  onTakePhoto,
  onSelectFromGallery,
  onDeletePhoto,
  onLogout,
  isLoggingOut,
}: ProfileCompProps) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader currentUser={currentUser} onOpenPhotoModal={onOpenPhotoModal} />

        <ProfileStats />

        <ProfileMenu />

        <AppButton
          title="Logout"
          icon={<LogoutIcon />}
          iconPosition="left"
          height={56}
          backgroundColor={theme.colors.surface}
          textColor="#FF4D67"
          borderRadius={15}
          borderwidth={1}
          bordercolor={theme.colors.border}
          fontSize={16}
          fontweight="500"
          onPress={() => setIsLogoutModalVisible(true)}
          style={styles.logoutButton}
        />
      </ScrollView>

      <ChangePhotoModal
        visible={isPhotoModalVisible}
        currentUser={currentUser}
        onClose={onClosePhotoModal}
        onTakePhoto={onTakePhoto}
        onSelectFromGallery={onSelectFromGallery}
        onDeletePhoto={onDeletePhoto}
      />

      <LogoutConfirmModal
        visible={isLogoutModalVisible}
        isLoggingOut={isLoggingOut}
        onCancel={() => setIsLogoutModalVisible(false)}
        onConfirm={() => {
          setIsLogoutModalVisible(false);
          onLogout();
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },

  logoutButton: {
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
});
