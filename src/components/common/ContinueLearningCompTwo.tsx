import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ContinueLearningCart } from "./ContinueLearningCart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLessonsByTopic } from "@/redux/actions";

const COLLAPSE_RANGE = 140;

interface ContinueLearningCompProps {
  scrollY: any;
  margintop: boolean;
  onHeightChange: (height: number) => void;
}

export const ContinueLearningComp = ({
  scrollY,
  margintop,
  onHeightChange,
}: ContinueLearningCompProps) => {
  const [cardHeight, setCardHeight] = useState(0);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.global);
  const topicId = currentUser?.lastReadTopic?.topicId;
  const topicTitle = currentUser?.lastReadTopic?.topicTitle;

  useEffect(() => {
    if (!topicId) return;

    setIsLoading(true);
    dispatch(fetchLessonsByTopic(topicId))
      .unwrap()
      .then((data) => {
        setLessons(data);
      })
      .catch((err) => {
        console.log("Failed to fetch lessons:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [topicId, dispatch]);

  const savedProgress = useMemo(() => {
    return currentUser?.userdata?.find(
      (entry) => entry.topicTitle === topicTitle && entry.topicId === topicId,
    );
  }, [currentUser?.userdata, topicTitle, topicId]);

  /* Check whether the topic is completed. */
  const isCompleted = savedProgress?.completed === true;

  /* Saved lesson index for an incomplete topic. */
  const currentLessonIndex = savedProgress?.lastLessonIndex ?? 0;

  const topicLessons = useMemo(
    () => [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber),
    [lessons],
  );

  /*
   * IMPORTANT: If topic is completed: display the LAST lesson.
   * Eg: 8 lessons
   * completed = true
   * displayLessonIndex = 7
   * currentLesson = 8
   */
  const displayLessonIndex =
    isCompleted && topicLessons.length > 0
      ? topicLessons.length - 1
      : currentLessonIndex;

  const { currentLessonTitle, nextLessonLabel, progressPercent } =
    useMemo(() => {
      if (topicLessons.length === 0) {
        return {
          currentLessonTitle: undefined,
          nextLessonLabel: undefined,
          progressPercent: 0,
        };
      }

      const safeIndex = Math.min(
        Math.max(displayLessonIndex, 0),
        topicLessons.length - 1,
      );

      const nextLesson = isCompleted ? undefined : topicLessons[safeIndex + 1];

      return {
        currentLessonTitle: topicLessons[safeIndex]?.title,
        nextLessonLabel: nextLesson?.title,

        /* Completed = 100%, Otherwise use the existing, progress calculation. */
        progressPercent: isCompleted
          ? 100
          : Math.round((currentLessonIndex / topicLessons.length) * 100),
      };
    }, [topicLessons, displayLessonIndex, currentLessonIndex, isCompleted]);

  /*
   * Resume / Restart navigation.
   * Incomplete: → saved lesson
   * Completed: → Lesson 1
   * The modal itself is handled inside ContinueLearningCart.
   */
  const handleResume = () => {
    if (!topicId) return;

    const lessonIndex = isCompleted ? 0 : currentLessonIndex;

    router.navigate({
      pathname: "/(StackScreens)/LessonScreen",

      params: {
        topicId,

        topicTitle: topicTitle ?? "",

        lessonIndex: String(lessonIndex),
      },
    });
  };

  const visualAnimationStyle = useAnimatedStyle(() => {
    if (!cardHeight) {
      return {};
    }

    const opacity = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE * 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE],
      [1, 0.92],
      Extrapolation.CLAMP,
    );

    return {
      opacity,

      transform: [
        {
          scale,
        },
      ],
    };
  });

  if (!topicId) {
    return null;
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          marginTop: margintop ? 15 : 0,
        },
      ]}
    >
      <View
        onLayout={(event) => {
          const newHeight = event.nativeEvent.layout.height;

          if (newHeight > 0 && Math.abs(newHeight - cardHeight) > 1) {
            setCardHeight(newHeight);

            onHeightChange(newHeight);
          }
        }}
      >
        <Animated.View style={visualAnimationStyle}>
          <ContinueLearningCart
            currentLesson={displayLessonIndex + 1}
            totalLessons={topicLessons.length}
            progressPercent={progressPercent}
            nextLessonLabel={nextLessonLabel}
            currentLessonTitle={currentLessonTitle}
            onResume={handleResume}
            isCompleted={isCompleted}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
});
