import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { UserData } from "@/utils/types/Apptypes";
import { PencilIcon } from "../../../assets/Svg/SvgIcons";
import ProfileAvatar from "./ProfileAvatar";

type ProfileHeaderProps = {
  currentUser: UserData;
  onOpenPhotoModal: () => void;
};

const ProfileHeader = ({ currentUser, onOpenPhotoModal }: ProfileHeaderProps) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.imageContainer}>
        <ProfileAvatar currentUser={currentUser} size={98} style={styles.profileImage} />

        <Pressable style={styles.editButton} onPress={onOpenPhotoModal} hitSlop={8}>
          <PencilIcon size={20} color={theme.colors.primary} />
        </Pressable>
      </View>

      <View style={styles.userDetails}>
        <Text style={styles.userName}>{currentUser.fullName}</Text>

        <Text style={styles.userEmail} numberOfLines={2}>
          {currentUser.email}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 22,
  },

  imageContainer: {
    width: 98,
    height: 98,
    position: "relative",
  },

  profileImage: {
    borderWidth: 3,
    borderColor: "#C8FF00",
  },

  editButton: {
    position: "absolute",
    right: 0,
    bottom: 3,
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  userDetails: {
    flex: 1,
    marginLeft: 16,
  },

  userName: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },

  userEmail: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: 5,
  },
});
