import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import {
  updateLastReadTopic,
  updateTopicProgress,
  fetchLessonsByTopic,
} from "@/redux/actions";
import { setSelectedTopic } from "@/redux/reducers";

const LessonComp = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const params = useLocalSearchParams<{
    topicId?: string;
    topicTitle?: string;
    lessonIndex?: string;
  }>();

  const { lessons, selectedTopicId, topics, currentUser, isLessonsLoading } =
    useSelector((state: RootState) => state.global);

  const activeTopicId = params.topicId || selectedTopicId;

  useEffect(() => {
    if (params.topicId && params.topicId !== selectedTopicId) {
      dispatch(setSelectedTopic(params.topicId));
    }
  }, [params.topicId]);

  useEffect(() => {
    if (!activeTopicId) return;
    const alreadyLoaded = lessons.some((l) => l.topicId === activeTopicId);
    if (!alreadyLoaded) {
      dispatch(fetchLessonsByTopic(activeTopicId));
    }
  }, [activeTopicId]);

  const selectedTopic = topics.find((topic) => topic.id === activeTopicId);
  const displayTopicTitle = selectedTopic?.title ?? params.topicTitle ?? "";

  const topicLessons = lessons
    .filter((lesson) => lesson.topicId === activeTopicId)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  const savedProgress = currentUser?.userdata?.find((entry) =>
    selectedTopic
      ? entry.topicId === activeTopicId &&
        entry.topicTitle === selectedTopic.title
      : entry.topicId === activeTopicId,
  );

  // If lessonIndex arrived via route params (Continue flow), trust it directly
  // — no need to re-derive from savedProgress, it's already the exact index.
  // Otherwise fall back to savedProgress (normal Topics-screen "Start" flow).
  const paramLessonIndex =
    params.lessonIndex !== undefined ? Number(params.lessonIndex) : undefined;

  const initialLessonIndex =
    paramLessonIndex !== undefined && !Number.isNaN(paramLessonIndex)
      ? paramLessonIndex
      : savedProgress?.completed
        ? 0
        : (savedProgress?.lastLessonIndex ?? 0);

  const [currentLessonIndex, setCurrentLessonIndex] =
    useState(initialLessonIndex);

  const [isSaving, setIsSaving] = useState(false);

  const lesson = topicLessons[currentLessonIndex];
  const isLastLesson =
    topicLessons.length > 0 && currentLessonIndex === topicLessons.length - 1;

  const progressPercent =
    topicLessons.length === 0
      ? 0
      : Math.round((currentLessonIndex / topicLessons.length) * 100);

  useEffect(() => {
    if (!currentUser || !activeTopicId || topicLessons.length === 0) return;

    dispatch(
      updateLastReadTopic({
        topicId: activeTopicId,
        topicTitle: displayTopicTitle,
        lastLessonIndex: currentLessonIndex,
        lessonTitle: lesson.title,
      }),
    );

    dispatch(
      updateTopicProgress({
        topickTitle: displayTopicTitle,
        topicId: activeTopicId,
        lastLessonIndex: currentLessonIndex,
        completed: savedProgress?.completed ?? false,
      }),
    );
  }, [currentLessonIndex, topicLessons.length]);

  const handleNext = async () => {
    if (isSaving) return;

    if (isLastLesson) {
      if (currentUser && activeTopicId) {
        try {
          setIsSaving(true);
          await dispatch(
            updateTopicProgress({
              topickTitle: displayTopicTitle,
              topicId: activeTopicId,
              lastLessonIndex: currentLessonIndex,
              completed: true,
            }),
          ).unwrap();
        } catch (err) {
          console.log("Unable to save progress", err);
        } finally {
          setIsSaving(false);
        }
      }
      router.back();
    } else {
      setCurrentLessonIndex((prev) => prev + 1);
    }
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
            disabled={isSaving}
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
          loadingTitle={isLastLesson ? "Saving..." : undefined}
          loading={isLastLesson && isSaving}
          disabled={isSaving}
          height={50}
          width={currentLessonIndex === 0 ? "100%" : "48%"}
          onPress={handleNext}
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
  container: { flex: 1, backgroundColor: theme.colors.background },
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
  backButton: { width: 10, height: 40 },
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
  scrollView: { flex: 1, paddingHorizontal: theme.spacing.md },
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
