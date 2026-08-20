import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { theme } from "@/utils/theme/Theme";
import { RootState } from "@/redux/store";
import { askGroq } from "@/services/Gemini";
import { ChatMessage } from "@/utils/types/Apptypes";
import ChatHeader from "./ChatHeader";
import WelcomeCard from "./WelcomeCard";
import SuggestedQuestions from "./SuggestedQuestions";
import ChatMessageBubble from "./ChatMessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInputBar from "./ChatInputBar";

const AIchatcomp = () => {
  const [message, setMessage] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const { currentUser } = useSelector((state: RootState) => state.global);

  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleSuggestionPress = (question: string) => {
    setMessage(question);
  };

  // Sends the typed message, then appends the AI reply once askGroq resolves.
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

  const showEmptyState = chatHistory.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ChatHeader
        onSettingsPress={() => console.log("Settings")}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
          onContentSizeChange={scrollToBottom}
        >
          {showEmptyState && <WelcomeCard fullName={currentUser?.fullName} />}

          {showEmptyState && (
            <SuggestedQuestions onSelectQuestion={handleSuggestionPress} />
          )}

          <View style={styles.chatContainer}>
            {chatHistory.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} onTypingProgress={scrollToBottom} />
            ))}

            {isSending && <TypingIndicator />}
          </View>
        </ScrollView>

        <ChatInputBar
          value={message}
          onChangeText={setMessage}
          onSend={handleSend}
          disabled={!message.trim() || isSending}
        />
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

  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 12,
  },

  chatContainer: {
    gap: 14,
  },
});
