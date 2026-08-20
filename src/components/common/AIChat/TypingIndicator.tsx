import { StyleSheet, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import { AIRobotIcon } from "../../../assets/Svg/SvgIcons";

// Three-dot bounce shown in place of the assistant bubble while a reply is loading.
const TypingIndicator = () => {
  return (
    <View style={[styles.messageRow, styles.messageRowAssistant]}>
      <View style={styles.avatarCircle}>
        <AIRobotIcon size={16} color={theme.colors.primary} />
      </View>

      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <View style={styles.typingDotsRow}>
          <View style={[styles.typingDot, styles.typingDot1]} />
          <View style={[styles.typingDot, styles.typingDot2]} />
          <View style={[styles.typingDot, styles.typingDot3]} />
        </View>
      </View>
    </View>
  );
};

export default TypingIndicator;

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  messageRowAssistant: {
    justifyContent: "flex-start",
  },

  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  messageBubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },

  assistantBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
  },

  typingDotsRow: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 2,
  },

  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.muted,
    opacity: 0.5,
  },

  typingDot1: { opacity: 0.35 },
  typingDot2: { opacity: 0.6 },
  typingDot3: { opacity: 0.9 },
});
