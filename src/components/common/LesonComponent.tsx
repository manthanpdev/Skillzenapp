import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useState } from "react";
import AppButton from "../ReusableComp/AppButton";
import {
  BackIcon,
  ChevronRightIcon,
  DoneIcon,
  QuestionIcon,
} from "../../assets/Svg/SvgIcons";
import { theme } from "@/utils/theme/Theme";

const lessons = [
  {
    id: "rn-cli-introduction-lesson-1",
    topicId: "rn-cli-introduction",
    lessonNumber: 1,
    title: "What is React Native?",
    overview:
      "React Native is an open-source framework developed by Meta that allows developers to build native Android and iOS applications using JavaScript or TypeScript. Instead of writing separate code for each platform, developers can use a single codebase while React Native renders real native UI components, providing users with a smooth and native-like experience.",
    example: {
      title: "Your First React Native Component",
      content: `import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <Text>Hello React Native!</Text>
    </View>
  );
}`,
    },
  },
  {
    id: "rn-cli-introduction-lesson-2",
    topicId: "rn-cli-introduction",
    lessonNumber: 2,
    title: "History of React Native",
    overview:
      "React Native was introduced by Meta in 2015 after engineers looked for a way to build mobile applications using the same principles as React. Since then, it has become one of the most popular frameworks for cross-platform mobile development and is trusted by companies worldwide.",
    example: {
      title: "Timeline",
      content:
        "React Native was announced by Meta in 2015. Since then, thousands of companies and developers have adopted it to build Android and iOS applications from a single codebase.",
    },
  },
  {
    id: "rn-cli-introduction-lesson-3",
    topicId: "rn-cli-introduction",
    lessonNumber: 3,
    title: "Why Should You Learn React Native?",
    overview:
      "React Native is widely used in the mobile development industry because it allows developers to build applications for both Android and iOS using one codebase. Learning React Native opens opportunities to create real-world applications while reducing development time and maintenance effort.",
    example: {
      title: "Real-World Example",
      content:
        "Imagine a startup wants both an Android app and an iPhone app. Instead of hiring two separate development teams, they can build most of the application using React Native, saving both time and money.",
    },
  },
  {
    id: "rn-cli-introduction-lesson-4",
    topicId: "rn-cli-introduction",
    lessonNumber: 4,
    title: "Advantages of React Native",
    overview:
      "React Native offers many advantages including code reusability, faster development with Fast Refresh, access to native device features, excellent community support, and the ability to build high-performance mobile applications using familiar JavaScript and TypeScript syntax.",
    example: {
      title: "Key Benefits",
      content: `• Single codebase for Android and iOS
- Faster development
- Native user interface
- Large community support
- Reusable components
- Easy maintenance`,
    },
  },
  {
    id: "rn-cli-introduction-lesson-5",
    topicId: "rn-cli-introduction",
    lessonNumber: 5,
    title: "Topic Summary",
    overview:
      "Congratulations! You have completed the Introduction to React Native topic. You now know what React Native is, its history, why developers use it, and its major advantages. These concepts provide the foundation for understanding how React Native works internally in the next topic.",
    example: {
      title: "Quick Revision",
      content: `✔ React Native was developed by Meta.
✔ It uses JavaScript or TypeScript.
✔ One codebase can build Android and iOS apps.
✔ It renders native UI components.
✔ It is widely used in the industry.`,
    },
  },
];

const LessonComp = () => {
  const router = useRouter();

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const lesson = lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === lessons.length - 1;

  return (
    <View style={styles.container}>
      {/* ---------------- Header ---------------- */}

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <AppButton
            onPress={() => router.back()}
            backgroundColor="transparent"
            icon={<BackIcon size={34} />}
            style={styles.backButton}
          />

          <Text style={styles.lessonTitle}>
            {lesson?.title ?? "Lesson Title"}
          </Text>
        </View>

        <Text style={styles.lessonCount}>
          Lesson {currentLessonIndex + 1} of {lessons.length}
        </Text>
      </View>

      {/* ---------------- Progress ---------------- */}

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  lessons.length === 0
                    ? 0
                    : ((currentLessonIndex + 1) / lessons.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {lessons.length === 0
            ? 0
            : Math.round(((currentLessonIndex + 1) / lessons.length) * 100)}
          %
        </Text>
      </View>

      {/* ---------------- Content ---------------- */}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview */}

        <Text style={styles.sectionTitle}>Overview</Text>

        <Text style={styles.overviewText}>{lesson?.overview}</Text>

        {/* Example */}

        <Text style={styles.sectionTitle}>Example</Text>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>{lesson?.example?.title}</Text>

          <View style={styles.codeCard}>
            <Text selectable style={styles.codeText}>
              {lesson?.example?.content}
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ---------------- Footer ---------------- */}

      <View style={styles.footer}>
        {/* Left Button */}
        <AppButton
          icon={<BackIcon />}
          iconPosition="left"
          title={"Previous"}
          height={50}
          width="48%"
          disabled={!isLastLesson && currentLessonIndex === 0}
          onPress={() => {
            if (isLastLesson) {
              // Navigate to Quiz Screen
              //   router.navigate("/(stackScreens)/QuizScreen");
            } else {
              if (currentLessonIndex > 0) {
                setCurrentLessonIndex((prev) => prev - 1);
              }
            }
          }}
          backgroundColor={theme.colors.card}
          textStyle={{ fontSize: 15 }}
          textColor={isLastLesson ? theme.colors.white : theme.colors.text}
          borderwidth={1}
          bordercolor={theme.colors.border}
        />

        {/* Right Button */}
        <AppButton
          icon={
            isLastLesson ? (
              <DoneIcon color={theme.colors.black} />
            ) : (
              <ChevronRightIcon color={theme.colors.black} />
            )
          }
          iconPosition="right"
          title={isLastLesson ? "Done" : "Next"}
          height={50}
          width="48%"
          onPress={() => {
            if (isLastLesson) {
              router.back();
            } else {
              setCurrentLessonIndex((prev) => prev + 1);
            }
          }}
          backgroundColor={theme.colors.primary}
          textStyle={{ fontSize: 15 }}
          textColor={theme.colors.black}
        />
      </View>
    </View>
  );
};

export default LessonComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  header: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 10,
    height: 40,
  },

  lessonTitle: {
    flex: 1,
    textAlign: "center",
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
  },

  lessonCount: {
    marginTop: 6,
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "left",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.round,
    overflow: "hidden",
    marginRight: 12,
  },

  progressFill: {
    width: "15%",
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.round,
  },

  progressText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },

  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 21,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },

  overviewText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },

  exampleCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },

  exampleTitle: {
    color: theme.colors.primary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  codeCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: theme.spacing.sm,
  },

  codeText: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 23,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
});
