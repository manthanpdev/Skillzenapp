import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "../ReusableComp/AppButton";

import { theme } from "@/utils/theme/Theme";
import {
  AIRobotIcon,
  AIPaperclipIcon,
  AIMicIcon,
  AISendIcon,
  AISparkleIcon,
  AISettingsIcon,
} from "../../assets/Svg/SvgIcons";
import AppTextInput from "../ReusableComp/CustomTextInput";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { askGroq } from "@/services/Gemini";

const suggestedQuestions = [
  "What is React Native?",
  "Explain useEffect",
  "Flexbox in RN",
  "State vs Props",
];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  animate?: boolean; // only true for a freshly-arrived assistant message
};

/**
 * Renders **bold**, `inline code`, and plain text within a single line.
 */
const InlineText = ({ line, style }: { line: string; style: any }) => {
  const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g).filter(Boolean);

  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={i} style={styles.boldText}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <Text key={i} style={styles.inlineCode}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
};

/**
 * Minimal markdown-ish renderer: headings, bullets, numbered lists,
 * code fences, horizontal rules, and plain paragraphs. No external libs.
 */
const FormattedMessage = ({ text }: { text: string }) => {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <View key={key++} style={styles.codeBlock}>
          <Text style={styles.codeBlockText}>{codeLines.join("\n")}</Text>
        </View>
      );
      continue;
    }

    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      blocks.push(<View key={key++} style={styles.hr} />);
      i++;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      blocks.push(
        <InlineText
          key={key++}
          line={content}
          style={level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3}
        />
      );
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      blocks.push(
        <View key={key++} style={styles.listItemRow}>
          <Text style={styles.bulletDot}>{"\u2022"}</Text>
          <InlineText
            line={trimmed.replace(/^[-*]\s+/, "")}
            style={styles.listItemText}
          />
        </View>
      );
      i++;
      continue;
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      blocks.push(
        <View key={key++} style={styles.listItemRow}>
          <Text style={styles.bulletDot}>{numberedMatch[1]}.</Text>
          <InlineText line={numberedMatch[2]} style={styles.listItemText} />
        </View>
      );
      i++;
      continue;
    }

    if (trimmed === "") {
      blocks.push(<View key={key++} style={styles.blankLine} />);
      i++;
      continue;
    }

    blocks.push(
      <InlineText key={key++} line={trimmed} style={styles.paragraph} />
    );
    i++;
  }

  return <View>{blocks}</View>;
};

/**
 * Reveals `fullText` word-by-word like a typing effect, then hands the
 * growing substring to FormattedMessage so markdown renders as it appears.
 */
const TypingMessage = ({
  fullText,
  onProgress,
}: {
  fullText: string;
  onProgress?: () => void;
}) => {
  const words = useRef(fullText.split(" ")).current;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= words.length) return;

    const timer = setTimeout(() => {
      setCount((c) => c + 1);
      onProgress?.();
    }, 28); // typing speed — lower = faster

    return () => clearTimeout(timer);
  }, [count, words.length]);

  const visibleText = words.slice(0, count).join(" ");
  const isDone = count >= words.length;

  return (
    <View>
      <FormattedMessage text={visibleText} />
      {!isDone && <View style={styles.typingCursor} />}
    </View>
  );
};

const AIchatcomp = () => {
  const [message, setMessage] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSuggestionPress = (question: string) => {
    setMessage(question);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);
    setTimeout(scrollToBottom, 50);

    const reply = await askGroq(trimmed);

    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        text: reply ?? "Something went wrong. Please try again.",
        animate: true,
      },
    ]);
    setIsSending(false);
    setTimeout(scrollToBottom, 50);
  };

  const { currentUser } = useSelector((state: RootState) => state.global);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ================= HEADER ================= */}
      <View
        style={styles.header}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
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
          onPress={() => console.log("Settings")}
        >
          <AISettingsIcon size={21} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
      >
        {/* ================= CONTENT ================= */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
          onContentSizeChange={scrollToBottom}
        >
          {/* ================= WELCOME CARD ================= */}
          {chatHistory.length === 0 && (
            <View style={styles.welcomeCard}>
              <View style={styles.robotContainer}>
                <AIRobotIcon size={42} color={theme.colors.primary} />
              </View>

              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeTitle}>
                  Hi, <Text style={styles.highlight}>{currentUser?.fullName} !</Text> 👋
                </Text>

                <Text style={styles.welcomeDescription}>
                  Ask me anything about React Native,{"\n"}
                  JavaScript, TypeScript and more.
                </Text>
              </View>
            </View>
          )}

          {chatHistory.length === 0 && (
            <>
              <View style={styles.suggestedHeader}>
                <View style={styles.sectionTitleContainer}>
                  <AISparkleIcon size={25} color={theme.colors.primary} />

                  <Text style={styles.sectionTitle}>Suggested Questions</Text>
                </View>

                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionList}
              >
                {suggestedQuestions.map((question) => (
                  <TouchableOpacity
                    key={question}
                    activeOpacity={0.75}
                    style={styles.suggestionPill}
                    onPress={() => handleSuggestionPress(question)}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* ================= CHAT ================= */}
          <View style={styles.chatContainer}>
            {chatHistory.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.role === "user"
                    ? styles.messageRowUser
                    : styles.messageRowAssistant,
                ]}
              >
                {msg.role === "assistant" && (
                  <View style={styles.avatarCircle}>
                    <AIRobotIcon size={16} color={theme.colors.primary} />
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    msg.role === "user"
                      ? styles.userBubble
                      : styles.assistantBubble,
                  ]}
                >
                  {msg.role === "user" ? (
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                  ) : msg.animate ? (
                    <TypingMessage fullText={msg.text} onProgress={scrollToBottom} />
                  ) : (
                    <FormattedMessage text={msg.text} />
                  )}
                </View>
              </View>
            ))}

            {isSending && (
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
            )}
          </View>
        </ScrollView>

        {/* ================= INPUT AREA (fixed footer, rides above keyboard) ================= */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <AppTextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask anything..."
              multiline
              inputContainerStyle={styles.chatInputContainer}
              containerStyle={styles.chatInputWrapper}
              leftIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.inputIconButton}
                >
                  <AIPaperclipIcon size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              }
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.inputIconButton}
                >
                  <AIMicIcon size={20} color={theme.colors.muted} />
                </TouchableOpacity>
              }
            />
          </View>

          <AppButton
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={theme.colors.primary}
            icon={<AISendIcon size={22} color={theme.colors.black} />}
            onPress={handleSend}
            disabled={!message.trim() || isSending}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIchatcomp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

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
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 12,
  },

  welcomeCard: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 20,
  },

  robotContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },

  highlight: {
    color: theme.colors.primary,
  },

  welcomeDescription: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  suggestedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  seeAll: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  suggestionList: {
    gap: 8,
    paddingBottom: 18,
  },

  suggestionPill: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  suggestionText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },

  chatContainer: {
    gap: 14,
  },

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

  // ===== Typing indicator (three-dot bounce, while waiting for response) =====
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

  // Small blinking-style cursor block shown at the end of text while typing out
  typingCursor: {
    width: 6,
    height: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 1,
    marginTop: 2,
    opacity: 0.7,
  },

  // ===== Formatted message styles =====
  paragraph: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },

  boldText: {
    fontWeight: "700",
    color: theme.colors.text,
  },

  inlineCode: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.primary,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 13,
  },

  h1: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 6,
  },

  h2: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 5,
  },

  h3: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 4,
  },

  listItemRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },

  bulletDot: {
    color: theme.colors.primary,
    fontWeight: "700",
    marginRight: 8,
    fontSize: 14,
  },

  listItemText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },

  codeBlock: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },

  codeBlockText: {
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
    fontSize: 12.5,
    color: theme.colors.text,
    lineHeight: 18,
  },

  hr: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },

  blankLine: {
    height: 6,
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 7,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
  },

  inputWrapper: {
    flex: 1,
  },

  chatInputWrapper: {
    marginBottom: 0,
  },

  chatInputContainer: {
    minHeight: 46,
    maxHeight: 90,
    height: "auto",
    borderRadius: 23,
    paddingLeft: 8,
    paddingRight: 7,
    alignItems: "center",
  },

  inputIconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButton: {
    marginBottom: 0,
  },
});