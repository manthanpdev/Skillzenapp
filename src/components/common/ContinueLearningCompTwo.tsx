import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ContinueLearningCart } from "./ContinueLearningCart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLessonsByTopic } from "@/redux/actions";

const COLLAPSE_RANGE = 140;

export const ContinueLearningComp = ({ scrollY, margintop }: any) => {
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
      .then((data) => setLessons(data))
      .catch((err) => console.log("Failed to fetch lessons:", err))
      .finally(() => setIsLoading(false));
  }, [topicId, dispatch]);

  const savedProgress = useMemo(() => {
    return currentUser?.userdata?.find(
      (entry) => entry.topicTitle === topicTitle && entry.topicId === topicId,
    );
  }, [currentUser?.userdata, topicTitle, topicId]);

  const currentLessonIndex = savedProgress?.completed
    ? 0
    : (savedProgress?.lastLessonIndex ?? 0);

  const topicLessons = useMemo(
    () => [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber),
    [lessons],
  );

  const { currentLessonTitle, nextLessonLabel, progressPercent } =
    useMemo(() => {
      if (topicLessons.length === 0) {
        return {
          currentLessonTitle: undefined,
          nextLessonLabel: undefined,
          progressPercent: 0,
          isLastLesson: false,
        };
      }

      const isLastLesson = currentLessonIndex >= topicLessons.length - 1;
      const nextLesson = isLastLesson
        ? undefined
        : topicLessons[currentLessonIndex + 1];

      return {
        currentLessonTitle: topicLessons[currentLessonIndex]?.title,
        nextLessonLabel: nextLesson?.title,
        progressPercent: Math.round(
          (currentLessonIndex / topicLessons.length) * 100,
        ),
        isLastLesson,
      };
    }, [topicLessons, currentLessonIndex]);

  // Pass topicId, title, AND the exact lesson index the user should land on.
  // LessonComp uses this directly as its initial index instead of re-deriving
  // it from savedProgress, so there's zero lookup/race risk on arrival.
  
  const handleResume = () => {
    if (!topicId) return;
    router.navigate({
      pathname: "/(StackScreens)/LessonScreen", // adjust to your actual lesson route
      params: {
        topicId,
        topicTitle: topicTitle ?? "",
        lessonIndex: String(currentLessonIndex),
      },
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (!cardHeight) return {};
    const height = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE],
      [cardHeight, 0],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE * 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const marginBottom = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE],
      [16, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE],
      [1, 0.92],
      Extrapolation.CLAMP,
    );
    return { height, opacity, marginBottom, transform: [{ scale }] };
  });

  if (!topicId) return null;

  return (
        <Animated.View
          style={[
            styles.wrap,
            cardHeight ? animatedStyle : undefined,
            { marginTop: margintop && 15 },
          ]}
          onLayout={(e) => {
            if (!cardHeight) setCardHeight(e.nativeEvent.layout.height);
          }}
        >
          <ContinueLearningCart
            currentLessonTitle={currentLessonTitle}
            currentLesson={currentLessonIndex + 1}
            totalLessons={topicLessons.length}
            progressPercent={progressPercent}
            nextLessonLabel={nextLessonLabel}
            isLoading={isLoading}
            onResume={handleResume}
          />
        </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    marginBottom: 0,
  },
});
