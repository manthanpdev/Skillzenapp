import React, { useMemo } from "react";
import { ContinueLearningCart } from "./ContinueLearningCart";
import { DUMMY_TOPICS } from "../../assets/Data/dummyTopicks";


export const ContinueLearningComp = () => {
  const { topic, currentLesson, progressPercent, nextLessonLabel, streakDays } =
    useMemo(() => {
      const topic = DUMMY_TOPICS[Math.floor(Math.random() * DUMMY_TOPICS.length)];

      const currentLesson = Math.floor(Math.random() * (topic.totalLessons - 1)) + 1;
      const progressPercent = Math.round((currentLesson / topic.totalLessons) * 100);
      const nextLessonLabel = `Lesson ${currentLesson + 1}: ${topic.title} basics`;
      const streakDays = Math.floor(Math.random() * 14) + 1;

      return { topic, currentLesson, progressPercent, nextLessonLabel, streakDays };
    }, []);

  const handleResume = () => {
    // TODO: navigate to the lesson screen, e.g.
    // navigation.navigate("Lesson", { topicId: topic.id, lessonNumber: currentLesson });
    console.log("Resume:", topic.id, currentLesson);
  };

  return (
    <ContinueLearningCart
      topicTitle={topic.title}
      currentLesson={currentLesson}
      totalLessons={topic.totalLessons}
      progressPercent={progressPercent}
      nextLessonLabel={nextLessonLabel}
      streakDays={streakDays}
      onResume={handleResume}
    />
  );
};