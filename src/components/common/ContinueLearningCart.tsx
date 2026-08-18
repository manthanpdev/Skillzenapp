import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../utils/theme/Theme";
import { ArrowIcon, LessonsIcon } from "../../assets/Svg/SvgIcons";
import { ContinueLearningCardProps } from "@/utils/types/Apptypes";

export const ContinueLearningCart = ({
  currentLesson,
  totalLessons,
  progressPercent,
  nextLessonLabel,
  onResume,
  currentLessonTitle,
}: ContinueLearningCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <LessonsIcon size={18} color={theme.colors.secondary} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>continue learning</Text>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {currentLessonTitle ?? "empty"}
          </Text>
        </View>
      </View>

      <View style={styles.box}>
        <Text style={styles.lessonText}>
          lesson {currentLesson} of {totalLessons}
        </Text>
        <Text style={styles.percentage}>{progressPercent}%</Text>
      </View>

      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(Math.max(progressPercent, 0), 100)}%` },
          ]}
        />
      </View>

      {nextLessonLabel && (
        <Text style={styles.nextText} numberOfLines={1}>
          Next: {nextLessonLabel}
        </Text>
      )}

      <TouchableOpacity
        style={styles.resumeButton}
        onPress={onResume}
        activeOpacity={0.85}
      >
        <Text style={styles.resumeText}>Resume lesson</Text>
        <ArrowIcon
          size={16}
          color={theme.colors.background}
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 175, 
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    justifyContent: "space-between", 
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.secondarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: { flex: 1, minWidth: 0 },
  eyebrow: {
    fontSize: 10,
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: "500",
    color: theme.colors.text,
  },
  lessonText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
  },
  percentage: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.small,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.sm,
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.md,
  },
  resumeText: {
    fontSize: theme.fontSize.small,
    fontWeight: "500",
    color: theme.colors.background,
  },
});
