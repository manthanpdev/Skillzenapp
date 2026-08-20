import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

import { theme } from "@/utils/theme/Theme";
import {
  AchievementIcon,
  BookmarkIcon,
  DownloadIcon,
  SettingsIcon,
  HelpIcon,
  ChevronRightIcon,
} from "../../../assets/Svg/SvgIcons";

type MenuItemProps = {
  icon: ReactNode;
  label: string;
};

const MenuItem = ({ icon, label }: MenuItemProps) => (
  <Pressable
    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
  >
    {icon}
    <Text style={styles.menuText}>{label}</Text>
    <ChevronRightIcon color={theme.colors.text} />
  </Pressable>
);

const ProfileMenu = () => {
  return (
    <>
      <View style={styles.menuContainer}>
        <MenuItem icon={<AchievementIcon />} label="Achievements" />
        <View style={styles.divider} />
        <MenuItem icon={<BookmarkIcon />} label="Bookmarks" />
        <View style={styles.divider} />
        <MenuItem icon={<DownloadIcon />} label="Downloads" />
      </View>

      <View style={styles.menuContainer}>
        <MenuItem icon={<SettingsIcon />} label="Settings" />
        <View style={styles.divider} />
        <MenuItem icon={<HelpIcon />} label="Help & Support" />
      </View>
    </>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 17,
    overflow: "hidden",
    marginBottom: 12,
  },

  menuItem: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  menuItemPressed: {
    opacity: 0.6,
    backgroundColor: theme.colors.card,
  },

  menuText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  divider: {
    height: 1,
    marginLeft: 51,
    backgroundColor: theme.colors.divider,
  },
});
