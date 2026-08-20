import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/utils/theme/Theme";
import type { UserData } from "@/utils/types/Apptypes";
import { CameraIcon, GalleryIcon, DeleteIcon } from "../../../assets/Svg/SvgIcons";
import AppButton from "../../ReusableComp/AppButton";
import ProfileAvatar from "./ProfileAvatar";

type ChangePhotoModalProps = {
  visible: boolean;
  currentUser: UserData;
  onClose: () => void;
  onTakePhoto: () => void;
  onSelectFromGallery: () => void;
  onDeletePhoto: () => void;
};

const ChangePhotoModal = ({
  visible,
  currentUser,
  onClose,
  onTakePhoto,
  onSelectFromGallery,
  onDeletePhoto,
}: ChangePhotoModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderSpace} />

            <Text style={styles.modalTitle}>Change Profile Photo</Text>

            <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.modalImageContainer}>
            <ProfileAvatar currentUser={currentUser} size={112} style={styles.modalProfileImage} />
          </View>

          <View style={styles.photoButtonsContainer}>
            <Pressable style={styles.photoOptionButton} onPress={onTakePhoto}>
              <CameraIcon />
              <Text style={styles.photoOptionText}>Take Photo</Text>
            </Pressable>

            <Pressable style={styles.photoOptionButton} onPress={onSelectFromGallery}>
              <GalleryIcon />
              <Text style={styles.photoOptionText}>Select from Gallery</Text>
            </Pressable>
          </View>

          <Pressable style={styles.deleteButton} onPress={onDeletePhoto}>
            <DeleteIcon />
            <Text style={styles.deleteButtonText}>Delete Photo</Text>
          </Pressable>

          <AppButton
            title="Cancel"
            height={52}
            backgroundColor={theme.colors.surface}
            textColor={theme.colors.text}
            borderRadius={14}
            borderwidth={1}
            bordercolor={theme.colors.border}
            fontSize={15}
            fontweight="700"
            onPress={onClose}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ChangePhotoModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1, 7, 18, 0.76)",
    paddingHorizontal: 15,
  },

  modalContent: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 22,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  modalHeaderSpace: {
    width: 34,
  },

  modalTitle: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },

  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 30,
  },

  modalImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  modalProfileImage: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  photoButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  photoOptionButton: {
    flex: 1,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 8,
  },

  photoOptionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  deleteButton: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 103, 0.55)",
    borderRadius: 14,
    backgroundColor: theme.colors.card,
    marginBottom: 12,
  },

  deleteButtonText: {
    color: "#FF4D67",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 10,
  },
});
