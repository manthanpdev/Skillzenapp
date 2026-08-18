import React from "react";
import { ICON_PALETTE, theme } from "@/utils/theme/Theme";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useDispatch, useSelector } from "react-redux";
import { BackIcon, CheckIcon, TopicIcon } from "../../assets/Svg/SvgIcons";
import { AppDispatch, RootState } from "@/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../ReusableComp/AppButton";
import { setSelectedTopic } from "@/redux/reducers";
import { fetchLessonsByTopic, updateLastReadTopic } from "@/redux/actions";

const RING_SIZE = 46;

const TopickComp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    categories,
    topics,
    selectedCategoryId,
    currentUser,
    isTopicsLoading,
  } = useSelector((state: RootState) => state.global);

  /* Stores the completed topic that the user clicked and is waiting for confirmation. */
  const [restartTopic, setRestartTopic] = React.useState<{
    topicId: string;
    topicTitle: string;
  } | null>(null);

  const category = categories.find((item) => item.id === selectedCategoryId);

  const categoryTopics = topics.filter(
    (item) => item.categoryId === selectedCategoryId,
  );

  const getTopicProgress = (topicId: string, totalLessons: number) => {
    if (totalLessons === 0) {
      return {
        percent: 0,
        completed: false,
      };
    }

    const topicProgress: any = currentUser?.userdata?.find(
      (progress) => progress.topicId === topicId,
    );

    if (!topicProgress) {
      return {
        percent: 0,
        completed: false,
      };
    }

    const lastLessonIndex = topicProgress.lastLessonIndex ?? 0;
    const completedLessons = Math.min(lastLessonIndex, totalLessons);
    const percent = topicProgress.completed
      ? 100
      : Math.round((completedLessons / totalLessons) * 100);
    const completed = topicProgress.completed ?? false;

    return {
      percent,
      completed,
    };
  };

  /*
   * Normal topic opening.
   * This is used for:
   * new topics
   * incomplete topics
   */
  const openTopic = async (
    topicId: string,
    topicTitle: string,
    lessonIndex: number,
  ) => {
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

  /*
   * Called when the user taps a topic.
   * IMPORTANT: Completed topic does NOT open immediately.
   * We first show the restart modal.
   */
  const handleTopicPress = (topicId: string, topicTitle: string) => {
    const topicProgress = currentUser?.userdata?.find(
      (progress) => progress.topicId === topicId,
    );

    const completed = topicProgress?.completed === true;

    /*
     * If topic is completed:
     * show confirmation modal.
     */
    if (completed) {
      setRestartTopic({
        topicId,
        topicTitle,
      });

      return;
    }

    /* Existing behavior for incomplete/new topic. */
    const startLessonIndex = topicProgress?.lastLessonIndex ?? 0;

    openTopic(topicId, topicTitle, startLessonIndex);
  };

  /* User selected "Start Again". Completed topic always starts from Lesson 1. */
  const handleRestartTopic = () => {
    if (!restartTopic) return;

    const { topicId, topicTitle } = restartTopic;

    /* Close modal first. */
    setRestartTopic(null);

    /* Start from Lesson 1. Array index 0 = Lesson 1.
     */
    openTopic(topicId, topicTitle, 0);
  };

  /* User selected Cancel. */
  const handleCancelRestart = () => {
    setRestartTopic(null);
  };

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <AppButton
            icon={<BackIcon color={theme.colors.text} />}
            onPress={() => router.back()}
            backgroundColor={theme.colors.card}
            width={38}
            height={38}
            borderRadius={theme.radius.sm}
            style={styles.backButton}
            hitSlop={10}
          />

          <Text style={styles.headerTitle}>{category?.title ?? "Topics"}</Text>

          <Text style={styles.headerSubtitle}>Choose a topic</Text>
        </View>

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

              const { percent, completed } = getTopicProgress(
                item.id,
                item.totalLessons,
              );

              const ringColor = completed ? theme.colors.primary : accent;

              const pieData = [
                {
                  value: percent,
                  color: ringColor,
                },
                {
                  value: 100 - percent,
                  color: theme.colors.border,
                },
              ];

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleTopicPress(item.id, item.title)}
                  style={styles.row}
                >
                  <View
                    style={[
                      styles.iconChip,
                      {
                        backgroundColor: `${accent}26`,
                        borderColor: `${accent}4D`,
                      },
                    ]}
                  >
                    <TopicIcon color={accent} />
                  </View>

                  <View style={styles.textCol}>
                    <Text numberOfLines={1} style={styles.title}>
                      {item.title}
                    </Text>

                    <Text style={styles.meta}>{item.totalLessons} Lessons</Text>
                  </View>

                  <View style={styles.progressWrap}>
                    <PieChart
                      data={pieData}
                      donut
                      radius={RING_SIZE / 2}
                      innerRadius={RING_SIZE / 2 - 5}
                      innerCircleColor={theme.colors.card}
                      centerLabelComponent={() =>
                        completed ? (
                          <CheckIcon color={theme.colors.primary} size={18} />
                        ) : (
                          <Text style={styles.progressPercentText}>
                            {percent}%
                          </Text>
                        )
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>

      {/* ========== COMPLETED TOPIC RESTART MODAL ========== */}

      <Modal
        visible={restartTopic !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelRestart}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Restart topic?</Text>

            <Text style={styles.modalMessage}>
              You have already completed this topic.
              {"\n"}
              Do you want to start it again from Lesson 1?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCancelRestart}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleRestartTopic}
                style={styles.restartButton}
              >
                <Text style={styles.restartText}>Start Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  header: {
    marginVertical: 10,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
  },

  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  headerSubtitle: {
    color: theme.colors.muted,
    fontSize: 17,
    fontWeight: "400",
    marginTop: 1,
    textAlign: "center",
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.sm + 2,
    gap: theme.spacing.sm + 2,
  },

  iconChip: {
    width: "16%",
    height: 55,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textCol: {
    flex: 1,
    gap: 2,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },

  meta: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.caption,
    fontWeight: "500",
  },

  progressWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercentText: {
    color: theme.colors.text,
    fontSize: 12,
  },

  /* =====================================================
     MODAL
     ===================================================== */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modalCard: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
  },

  modalTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  modalMessage: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  cancelText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.small,
    fontWeight: "500",
  },

  restartButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },

  restartText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.small,
    fontWeight: "500",
  },
});
