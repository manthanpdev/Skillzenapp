import { useState } from "react";
import { ICON_PALETTE, theme } from "@/utils/theme/Theme";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../ReusableComp/AppButton";
import { setSelectedTopic } from "@/redux/reducers";
import { fetchLessonsByTopic, updateLastReadTopic } from "@/redux/actions";
import TopicsHeader from "./TopicsHeader";
import TopicRow from "./TopicRow";
import RestartTopicModal from "./RestartTopicModal";

const TopickComp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, topics, selectedCategoryId, currentUser, isTopicsLoading } = useSelector(
    (state: RootState) => state.global,
  );

  // The completed topic the user tapped, waiting for restart confirmation.
  const [restartTopic, setRestartTopic] = useState<{
    topicId: string;
    topicTitle: string;
  } | null>(null);

  const category = categories.find((item) => item.id === selectedCategoryId);

  const categoryTopics = topics.filter((item) => item.categoryId === selectedCategoryId);

  const getTopicProgress = (topicId: string, totalLessons: number) => {
    if (totalLessons === 0) {
      return { percent: 0, completed: false };
    }

    const topicProgress: any = currentUser?.userdata?.find(
      (progress) => progress.topicId === topicId,
    );

    if (!topicProgress) {
      return { percent: 0, completed: false };
    }

    const lastLessonIndex = topicProgress.lastLessonIndex ?? 0;
    const completedLessons = Math.min(lastLessonIndex, totalLessons);
    const percent = topicProgress.completed
      ? 100
      : Math.round((completedLessons / totalLessons) * 100);
    const completed = topicProgress.completed ?? false;

    return { percent, completed };
  };

  // Normal topic opening — used for new topics and incomplete topics.
  const openTopic = async (topicId: string, topicTitle: string, lessonIndex: number) => {
    dispatch(setSelectedTopic(topicId));
    dispatch(fetchLessonsByTopic(topicId));
    dispatch(
      updateLastReadTopic({
        topicId,
        topicTitle,
        lastLessonIndex: lessonIndex,
        lessonTitle: "",
      }),
    );

    router.navigate({
      pathname: "/LessonScreen",
      params: {
        topicId,
        topicTitle,
        lessonIndex: String(lessonIndex),
      },
    });
  };

  // A completed topic does NOT open immediately — the restart modal is shown first.
  const handleTopicPress = (topicId: string, topicTitle: string) => {
    const topicProgress = currentUser?.userdata?.find((progress) => progress.topicId === topicId);

    const completed = topicProgress?.completed === true;

    if (completed) {
      setRestartTopic({ topicId, topicTitle });
      return;
    }

    const startLessonIndex = topicProgress?.lastLessonIndex ?? 0;
    openTopic(topicId, topicTitle, startLessonIndex);
  };

  // "Start Again" — a completed topic always restarts from Lesson 1 (index 0).
  const handleRestartTopic = () => {
    if (!restartTopic) return;

    const { topicId, topicTitle } = restartTopic;
    setRestartTopic(null);
    openTopic(topicId, topicTitle, 0);
  };

  const handleCancelRestart = () => {
    setRestartTopic(null);
  };

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <TopicsHeader title={category?.title ?? "Topics"} onBack={() => router.back()} />

        {isTopicsLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : categoryTopics.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No topics found</Text>

            <Text style={styles.emptySubtitle}>
              This category does not have any topics yet.
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
        ) : (
          <FlatList
            data={categoryTopics}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const accent = ICON_PALETTE[index % ICON_PALETTE.length];
              const { percent, completed } = getTopicProgress(item.id, item.totalLessons);

              return (
                <TopicRow
                  item={item}
                  accentColor={accent}
                  percent={percent}
                  completed={completed}
                  onPress={() => handleTopicPress(item.id, item.title)}
                />
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>

      <RestartTopicModal
        visible={restartTopic !== null}
        onCancel={handleCancelRestart}
        onConfirm={handleRestartTopic}
      />
    </>
  );
};

export default TopickComp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
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

  listContent: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 60,
    gap: theme.spacing.sm,
  },
});
