import { Modal, StyleSheet, Text, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import { LogoutIcon } from "../../../assets/Svg/SvgIcons";
import AppButton from "../../ReusableComp/AppButton";

type LogoutConfirmModalProps = {
  visible: boolean;
  isLoggingOut?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const LogoutConfirmModal = ({
  visible,
  isLoggingOut,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.confirmOverlay}>
        <View style={styles.confirmContainer}>
          <LogoutIcon />

          <Text style={styles.confirmTitle}>Logout?</Text>

          <Text style={styles.confirmMessage}>
            Are you sure you want to logout from your account?
          </Text>

          <View style={styles.confirmButtons}>
            <AppButton
              title="Cancel"
              width="48%"
              height={48}
              backgroundColor={theme.colors.surface}
              textColor={theme.colors.text}
              borderRadius={12}
              borderwidth={1}
              bordercolor={theme.colors.border}
              onPress={onCancel}
            />

            <AppButton
              title="Logout"
              width="48%"
              height={48}
              backgroundColor="#FF4D67"
              textColor="#FFFFFF"
              borderRadius={12}
              onPress={onConfirm}
              loading={isLoggingOut}
              loadingTitle="Logging out..."
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmModal;

const styles = StyleSheet.create({
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 24,
  },

  confirmContainer: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24,
    alignItems: "center",
  },

  confirmTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
  },

  confirmMessage: {
    color: theme.colors.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },

  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
