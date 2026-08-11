import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppButton from "../ReusableComp/AppButton";
import { theme } from "../../utils/theme/Theme";
import type { ProfileCompProps } from "../../utils/types/Apptypes";

import {
  PencilIcon,
  AchievementIcon,
  ChevronRightIcon,
  BookmarkIcon,
  DownloadIcon,
  SettingsIcon,
  HelpIcon,
  LogoutIcon,
  CameraIcon,
  GalleryIcon,
  DeleteIcon,
} from "../../assets/Svg/SvgIcons";

const ProfileComp = ({
  currentUser,
  isPhotoModalVisible,
  onOpenPhotoModal,
  onClosePhotoModal,
  onTakePhoto,
  onSelectFromGallery,
  onDeletePhoto,
  onLogout,
}: ProfileCompProps) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const firstLetter = currentUser?.fullName?.charAt(0)?.toUpperCase() || "U";

  const profilePhoto = currentUser?.photo || currentUser?.googlePhoto || null;

  const renderProfileImage = (size: number, borderWidth = 4) => {
    if (profilePhoto) {
      return (
        <Image
          source={{ uri: profilePhoto }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
            borderColor: theme.colors.primary,
          }}
        />
      );
    }

    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.card,
          justifyContent: "center",
          alignItems: "center",
          borderWidth,
          borderColor: theme.colors.primary,
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            fontSize: size / 2.4,
            fontWeight: "800",
          }}
        >
          {firstLetter}
        </Text>
      </View>
    );
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    onPress?: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.menuLeft}>
        {icon}
        <Text style={styles.menuText}>{title}</Text>
      </View>

      <ChevronRightIcon color={theme.colors.text} />
    </Pressable>
  );

  const StatCard = ({ value, title }: { value: string; title: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const handleLogout = () => {
    setIsLogoutModalVisible(false);
    onLogout();
  };
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= PROFILE ================= */}

        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            {renderProfileImage(120)}

            <Pressable style={styles.editButton} onPress={onOpenPhotoModal}>
              <PencilIcon size={18} color={theme.colors.primary} />
            </Pressable>
          </View>

          <Text style={styles.userName}>
            {currentUser.fullName || "Manthan Patel"}
          </Text>

          <Text style={styles.userEmail}>
            {currentUser.email || "manthan@gmail.com"}
          </Text>
        </View>

        {/* ================= STATS ================= */}

        <View style={styles.statsRow}>
          <StatCard value="24" title="Lessons" />

          <StatCard value="12" title="Tasks" />

          <StatCard value="8" title="Quizzes" />
        </View>

        {/* ================= MENU ================= */}

        <View style={styles.menuContainer}>
          <MenuItem icon={<AchievementIcon />} title="Achievements" />

          <MenuItem icon={<BookmarkIcon />} title="Bookmarks" />

          <MenuItem icon={<DownloadIcon />} title="Downloads" />

          <MenuItem icon={<SettingsIcon />} title="Settings" />

          <MenuItem icon={<HelpIcon />} title="Help & Support" />
        </View>

        {/* ================= LOGOUT ================= */}

        <AppButton
          title="Logout"
          icon={<LogoutIcon />}
          iconPosition="left"
          height={56}
          borderRadius={18}
          backgroundColor="#FF4D67"
          textColor="#FFFFFF"
          onPress={() => setIsLogoutModalVisible(true)}
          style={styles.logoutButton}
        />

        {/* ================= PHOTO MODAL ================= */}

        <Modal
          visible={isPhotoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={onClosePhotoModal}
        >
          <Pressable
            style={styles.centerModalBackground}
            onPress={onClosePhotoModal}
          >
            <Pressable style={styles.photoModal} onPress={() => {}}>
              {renderProfileImage(90, 3)}

              <Text style={styles.photoTitle}>Change Profile Photo</Text>

              <Pressable style={styles.photoOption} onPress={onTakePhoto}>
                <CameraIcon />

                <Text style={styles.photoOptionText}>Take Photo</Text>
              </Pressable>

              <Pressable
                style={styles.photoOption}
                onPress={onSelectFromGallery}
              >
                <GalleryIcon />

                <Text style={styles.photoOptionText}>Select From Gallery</Text>
              </Pressable>

              <Pressable
                style={styles.deletePhotoButton}
                onPress={onDeletePhoto}
              >
                <DeleteIcon />

                <Text style={styles.deleteText}>Delete Photo</Text>
              </Pressable>

              <AppButton
                title="Close"
                height={50}
                borderRadius={14}
                backgroundColor={theme.colors.surface}
                borderwidth={1}
                bordercolor={theme.colors.border}
                textColor={theme.colors.text}
                onPress={onClosePhotoModal}
              />
            </Pressable>
          </Pressable>
        </Modal>
        {/* ================= LOGOUT MODAL ================= */}

        <Modal
          visible={isLogoutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsLogoutModalVisible(false)}
        >
          <View style={styles.centerModalBackground}>
            <View style={styles.logoutModal}>
              <View style={styles.logoutIconContainer}>
                <LogoutIcon />
              </View>

              <Text style={styles.logoutTitle}>Logout?</Text>

              <Text style={styles.logoutSubtitle}>
                Are you sure you want to logout from your account?
              </Text>

              <View style={styles.logoutButtons}>
                <AppButton
                  title="Cancel"
                  width="48%"
                  height={50}
                  borderRadius={14}
                  backgroundColor={theme.colors.surface}
                  borderwidth={1}
                  bordercolor={theme.colors.border}
                  textColor={theme.colors.text}
                  onPress={() => setIsLogoutModalVisible(false)}
                />

                <AppButton
                  title="Logout"
                  width="48%"
                  height={50}
                  borderRadius={14}
                  backgroundColor="#FF4D67"
                  textColor="#FFFFFF"
                  onPress={handleLogout}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default ProfileComp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  profileImageWrapper: {
    width: 126,
    height: 126,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  editButton: {
    position: "absolute",
    right: 0,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  userName: {
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 6,
  },

  userEmail: {
    color: theme.colors.muted,
    fontSize: 15,
    marginBottom: 18,
  },

  levelContainer: {
    flexDirection: "row",
    gap: 12,
  },

  levelBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  levelText: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  statCard: {
    width: "31%",
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 20,
    alignItems: "center",
  },

  statNumber: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },

  statTitle: {
    color: theme.colors.muted,
    marginTop: 6,
    fontSize: 13,
  },

  learningCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    marginBottom: 24,
  },

  learningTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  learningSubtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 18,
  },

  progressBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.card,
    overflow: "hidden",
  },

  progressFill: {
    width: "78%",
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },

  progressText: {
    color: theme.colors.primary,
    fontWeight: "700",
    marginTop: 10,
    fontSize: 13,
  },

  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 26,
    overflow: "hidden",
  },

  menuItem: {
    height: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
  },

  logoutButton: {
    marginBottom: 30,
  },

  centerModalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 24,
  },
  photoModal: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 22,
    alignItems: "center",
  },

  photoTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 24,
  },

  photoOption: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
  },

  photoOptionText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 14,
  },

  deletePhotoButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,77,103,0.12)",
    borderWidth: 1,
    borderColor: "#FF4D67",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 4,
    marginBottom: 20,
  },

  deleteText: {
    color: "#FF4D67",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 12,
  },

  logoutModal: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
    alignItems: "center",
  },

  logoutIconContainer: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,77,103,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  logoutTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },

  logoutSubtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 26,
  },

  logoutButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
