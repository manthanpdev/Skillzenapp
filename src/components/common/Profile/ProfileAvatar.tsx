import { Image, StyleSheet, Text, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { UserData } from "@/utils/types/Apptypes";

type ProfileAvatarProps = {
  currentUser: UserData;
  size: number;
  style?: object;
};

const ProfileAvatar = ({ currentUser, size, style }: ProfileAvatarProps) => {
  const firstLetter = currentUser.fullName?.charAt(0).toUpperCase() || "U";
  const profilePhoto = currentUser.photo || currentUser.googlePhoto;

  if (profilePhoto) {
    return (
      <Image
        source={{ uri: profilePhoto }}
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.defaultImage,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={styles.defaultImageText}>{firstLetter}</Text>
    </View>
  );
};

export default ProfileAvatar;

const styles = StyleSheet.create({
  defaultImage: {
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  defaultImageText: {
    color: theme.colors.text,
    fontSize: 38,
    fontWeight: "800",
  },
});
