import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AppButton from "../ReusableComp/AppButton";
import {
  BackIcon,
  ChevronRightIcon,
  DoneIcon,
} from "../../assets/Svg/SvgIcons";
import { theme } from "@/utils/theme/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {  updateTopicProgress } from "@/redux/actions";

const LessonComp = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { lessons, selectedTopicId, topics, currentUser, isLessonsLoading } =
    useSelector((state: RootState) => state.global);

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);

  const topicLessons = lessons
    .filter((lesson) => lesson.topicId === selectedTopicId)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  // Find saved progress for this exact topic (if any)
  const savedProgress = currentUser?.userdata?.find(
    (entry) =>
      entry.categoryTitle === selectedTopic?.title &&
      entry.topicId === selectedTopicId,
  );

  const [currentLessonIndex, setCurrentLessonIndex] = useState(
    savedProgress?.completed ? 0 : (savedProgress?.lastLessonIndex ?? 0),
  );

const lesson = topicLessons[currentLessonIndex];
const isLastLesson =
  topicLessons.length > 0 && currentLessonIndex === topicLessons.length - 1;
  
const progressPercent =
  topicLessons.length === 0
    ? 0
    : Math.round((currentLessonIndex / topicLessons.length) * 100);


  // Save progress whenever the lesson index changes (Next / Previous)
 useEffect(() => {
  if (!currentUser || !selectedTopicId || topicLessons.length === 0) return;

  dispatch(
    updateTopicProgress({
      categoryTitle: selectedTopic?.title ?? "",
      topicId: selectedTopicId,
      lastLessonIndex: currentLessonIndex,
      completed: isLastLesson,
    }),
  );
}, [currentLessonIndex]);

const handleDone = () => {
  if (currentUser && selectedTopicId) {
    dispatch(
      updateTopicProgress({
        categoryTitle: selectedTopic?.title ?? "",
        topicId: selectedTopicId,
        lastLessonIndex: currentLessonIndex,
        completed: true,
      }),
    );
  }
  router.back();
};

  if (isLessonsLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  if (!lesson) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No lessons found</Text>

        <Text style={styles.emptySubtitle}>
          This topic does not have any lessons yet.
        </Text>

        <AppButton
          title="Go Back"
          onPress={() => router.back()}
          backgroundColor={theme.colors.primary}
          textColor={theme.colors.black}
          width={120}
          height={45}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <AppButton
            onPress={() => router.back()}
            backgroundColor="transparent"
            icon={<BackIcon size={34} />}
            style={styles.backButton}
          />

          <Text style={styles.lessonTitle}>{lesson.title}</Text>
        </View>

        <Text style={styles.lessonCount}>
          Lesson {currentLessonIndex + 1} of {topicLessons.length}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>{progressPercent}%</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overviewText}>{lesson.overview}</Text>
        <Text style={styles.sectionTitle}>Example</Text>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>{lesson.example.title}</Text>

          <View style={styles.codeCard}>
            <Text selectable style={styles.codeText}>
              {lesson.example.content}
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        {currentLessonIndex > 0 && (
          <AppButton
            icon={<BackIcon />}
            iconPosition="left"
            title="Previous"
            height={50}
            width="48%"
            onPress={() => {
              setCurrentLessonIndex((prev) => prev - 1);
            }}
            backgroundColor={theme.colors.card}
            textStyle={{ fontSize: 15 }}
            textColor={theme.colors.text}
            borderwidth={1}
            bordercolor={theme.colors.border}
          />
        )}

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
          width={currentLessonIndex === 0 ? "100%" : "48%"}
          onPress={() => {
            if (isLastLesson) {
              handleDone();
            } else {
              setCurrentLessonIndex((prev) => prev + 1);
            }
          }}
          backgroundColor={theme.colors.primary}
          textStyle={{ fontSize: 15 }}
          textColor={theme.colors.black}
        />
      </View>
    </SafeAreaView>
  );
};

export default LessonComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },

  emptyTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptySubtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
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

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
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