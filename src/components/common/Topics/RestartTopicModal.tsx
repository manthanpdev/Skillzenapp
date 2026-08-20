import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { RestartTopicModalProps } from "@/utils/types/Apptypes";

// Shown when the user taps an already-completed topic, asking whether to
// restart it from Lesson 1 (confirming re-opens it fresh; cancelling closes only).
const RestartTopicModal = ({ visible, onCancel, onConfirm }: RestartTopicModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Restart topic?</Text>

          <Text style={styles.modalMessage}>
            You have already completed this topic.
            {"\n"}
            Do you want to start it again from Lesson 1?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity activeOpacity={0.85} onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              style={styles.restartButton}
            >
              <Text style={styles.restartText}>Start Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RestartTopicModal;

const styles = StyleSheet.create({
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
