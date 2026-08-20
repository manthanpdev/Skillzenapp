import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/utils/theme/Theme";
import type { ChatMessageBubbleProps } from "@/utils/types/Apptypes";
import { AIRobotIcon } from "../../../assets/Svg/SvgIcons";
import FormattedMessage from "./MessageFormatter";
import TypingMessage from "./TypingMessage";

// Renders one row of the conversation: user messages are plain text,
// assistant messages are markdown-formatted (typed out if `animate` is set).
const ChatMessageBubble = ({ message, onTypingProgress }: ChatMessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <View
      style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}
    >
      {!isUser && (
        <View style={styles.avatarCircle}>
          <AIRobotIcon size={16} color={theme.colors.primary} />
        </View>
      )}

      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {isUser ? (
          <Text style={styles.userMessageText}>{message.text}</Text>
        ) : message.animate ? (
          <TypingMessage fullText={message.text} onProgress={onTypingProgress} />
        ) : (
          <FormattedMessage text={message.text} />
        )}
      </View>
    </View>
  );
};

export default ChatMessageBubble;

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  messageRowUser: {
    justifyContent: "flex-end",
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

  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },

  assistantBubble: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
  },

  userMessageText: {
    color: theme.colors.black,
    fontSize: 14,
    lineHeight: 20,
  },
});
