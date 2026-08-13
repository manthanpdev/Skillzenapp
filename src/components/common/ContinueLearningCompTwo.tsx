import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { DUMMY_TOPICS } from "../../utils/constants/dummyTopicks";
import { ContinueLearningCart } from "./ContinueLearningCart";

const COLLAPSE_RANGE = 140; // px of scroll over which the card fully collapses

export const ContinueLearningComp = ({ scrollY, margintop }: any) => {
  const [cardHeight, setCardHeight] = useState(0);

  const { topic, currentLesson, progressPercent, nextLessonLabel, streakDays } =
    useMemo(() => {
      const topic =
        DUMMY_TOPICS[Math.floor(Math.random() * DUMMY_TOPICS.length)];

      const currentLesson =
        Math.floor(Math.random() * (topic.totalLessons - 1)) + 1;
      const progressPercent = Math.round(
        (currentLesson / topic.totalLessons) * 100,
      );
      const nextLessonLabel = `Lesson ${currentLesson + 1}: ${topic.title} basics`;
      const streakDays = Math.floor(Math.random() * 14) + 1;

      return {
        topic,
        currentLesson,
        progressPercent,
        nextLessonLabel,
        streakDays,
      };
    }, []);

  const handleResume = () => {
    // TODO: navigate to the lesson screen, e.g.
    // navigation.navigate("Lesson", { topicId: topic.id, lessonNumber: currentLesson });
    console.log("Resume:", topic.id, currentLesson);
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

    return {
      height,
      opacity,
      marginBottom,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.wrap,
        cardHeight ? animatedStyle : undefined,
        {
          marginTop: margintop && 15,
        },
      ]}
      onLayout={(e) => {
        if (!cardHeight) setCardHeight(e.nativeEvent.layout.height);
      }}
    >
      <ContinueLearningCart
        topicTitle={topic.title}
        currentLesson={currentLesson}
        totalLessons={topic.totalLessons}
        progressPercent={progressPercent}
        nextLessonLabel={nextLessonLabel}
        streakDays={streakDays}
        onResume={handleResume}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    marginBottom: 0
  },
});