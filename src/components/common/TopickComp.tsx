import { ICON_PALETTE, theme } from "@/utils/theme/Theme";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
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
import { fetchLessonsByTopic } from "@/redux/actions";

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
    const topicProgress = currentUser?.userData?.find(
      (progress) => progress.topicId === topicId,
    );

    if (!topicProgress) {
      return {
        percent: 0,
        completed: false,
      };
    }

    const completedLessons =
      topicProgress.lastLessonIndex < 0
        ? 0
        : Math.min(topicProgress.lastLessonIndex + 1, totalLessons);

    const percent = Math.round((completedLessons / totalLessons) * 100);

    const completed = topicProgress.completed || percent === 100;

    return {
      percent,
      completed,
    };
  };

  return (
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
                onPress={async () => {
                  dispatch(setSelectedTopic(item.id));
                  router.navigate("/LessonScreen");
                  dispatch(fetchLessonsByTopic(item.id));
                }}
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
});
