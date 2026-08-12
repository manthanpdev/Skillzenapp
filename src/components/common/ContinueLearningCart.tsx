import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../utils/theme/Theme";
import {
  ArrowIcon,
  LessonsIcon,
} from "../../assets/Svg/SvgIcons";
import { ContinueLearningCardProps } from "@/utils/types/Apptypes";

export const ContinueLearningCart = ({
  topicTitle,
  currentLesson,
  totalLessons,
  progressPercent,
  nextLessonLabel,
  onResume,
}: ContinueLearningCardProps) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <LessonsIcon size={18} color={theme.colors.secondary} />
          </View>
          <View>
            <Text style={styles.eyebrow}>continue learning</Text>
            <Text style={styles.title}>{topicTitle}</Text>
          </View>
        </View>
      </View>

      {/* Progress row */}
      <View style={styles.progressRow}>
        <View style={styles.progressTextRow}>
          <Text style={styles.lessonText}>
            lesson {currentLesson} of {totalLessons}
          </Text>
          <Text style={styles.ringLabel}>{progressPercent}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max(progressPercent, 0), 100)}%` },
            ]}
          />
        </View>

        <Text style={styles.nextText} numberOfLines={1}>
          next: {nextLessonLabel}
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.resumeButton}
        onPress={onResume}
        activeOpacity={0.85}
      >
        <Text style={styles.resumeText}>resume lesson</Text>
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
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginHorizontal: "auto",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm + 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.secondarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
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

  
  progressRow: {
    marginBottom: theme.spacing.sm + 4,
  },
  progressTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  lessonText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  ringLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: theme.colors.text,
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
  nextText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.placeholder,
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