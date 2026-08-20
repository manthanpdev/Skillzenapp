import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/utils/theme/Theme";
import type { ChatHeaderProps } from "@/utils/types/Apptypes";
import { AISettingsIcon } from "../../../assets/Svg/SvgIcons";

const ChatHeader = ({ onSettingsPress, onLayout }: ChatHeaderProps) => {
  return (
    <View style={styles.header} onLayout={onLayout}>
      <View>
        <Text style={styles.headerTitle}>
          <Text style={styles.headerHighlight}>AI </Text>
          Assistant
        </Text>

        <Text style={styles.headerSubtitle}>Your learning companion</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.settingsButton}
        onPress={onSettingsPress}
      >
        <AISettingsIcon size={21} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: 8,
    paddingBottom: 14,
  },

  headerTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },

  headerHighlight: {
    color: theme.colors.primary,
  },

  headerSubtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
