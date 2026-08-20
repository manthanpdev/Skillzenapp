import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { theme } from "../../utils/theme/Theme";
import { ArrowIcon, LessonsIcon } from "../../assets/Svg/SvgIcons";
import { ContinueLearningCardProps } from "@/utils/types/Apptypes";
interface Props extends ContinueLearningCardProps {
  isCompleted: boolean;
}

export const ContinueLearningCart = ({
  currentLesson,
  totalLessons,
  progressPercent,
  nextLessonLabel,
  onResume,
  currentLessonTitle,
  isCompleted,
}: Props) => {
  const [showRestartModal, setShowRestartModal] = useState(false);

  const handleButtonPress = () => {
    if (isCompleted) {
      setShowRestartModal(true);
      return;
    }

    onResume?.();
  };

  const handleRestart = () => {
    setShowRestartModal(false);
    onResume?.();
  };

  return (
    <>
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
              {
                width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
              },
            ]}
          />
        </View>

        {/* Only show Next when the topic is NOT completed. */}
        {!isCompleted && nextLessonLabel && (
          <Text style={styles.nextText} numberOfLines={1}>
            Next: {nextLessonLabel}
          </Text>
        )}

        {/* Completed topic:  Show "Let's take it again" */}
        {isCompleted && (
          <Text style={styles.againText}>Let's take it again</Text>
        )}

        <TouchableOpacity
          style={styles.resumeButton}
          onPress={handleButtonPress}
          activeOpacity={0.85}
        >
          <Text style={styles.resumeText}>
            {isCompleted ? "Restart lesson" : "Resume lesson"}
          </Text>

          {!isCompleted && (
            <ArrowIcon
              size={16}
              color={theme.colors.background}
              strokeWidth={2.5}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* =================  RESTART MODAL  ================= */}

      <Modal
        visible={showRestartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRestartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Restart lesson?</Text>

            <Text style={styles.modalMessage}>
              This topic is already completed.
              {"\n"}
              Do you want to start again from Lesson 1?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.85}
                onPress={() => setShowRestartModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restartButton}
                activeOpacity={0.85}
                onPress={handleRestart}
              >
                <Text style={styles.restartText}>Start again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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

  titleWrap: {
    flex: 1,
    minWidth: 0,
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
    fontSize: 13,
    fontWeight: "500",
  },

  box: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  nextText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },

  againText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },

  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.sm,
    marginTop: 3,
  },

  resumeText: {
    fontSize: theme.fontSize.small,
    fontWeight: "500",
    color: theme.colors.background,
  },

  /* =======  MODAL  ======= */
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
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  modalTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },

  modalMessage: {
    fontSize: theme.fontSize.body,
    lineHeight: 21,
    color: theme.colors.textSecondary,
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
    fontSize: theme.fontSize.small,
    fontWeight: "500",
    color: theme.colors.text,
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
    fontSize: theme.fontSize.small,
    fontWeight: "500",
    color: theme.colors.background,
  },
});
