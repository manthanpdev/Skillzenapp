import React, { useState } from "react";
import {
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

const suggestedQuestions = [
  "What is React Native?",
  "Explain useEffect",
  "Flexbox in RN",
  "State vs Props",
];

const AIchatcomp = () => {
  const [message, setMessage] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleSuggestionPress = (question: string) => {
    setMessage(question);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("Send:", message);
    setMessage("");
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contentContainer}
        >
          {/* ================= WELCOME CARD ================= */}
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

          {/* ================= CHAT ================= */}
          <View style={styles.chatContainer}></View>
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
            disabled={!message.trim()}
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
