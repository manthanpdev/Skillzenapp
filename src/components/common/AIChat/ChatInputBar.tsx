import { StyleSheet, TouchableOpacity, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { ChatInputBarProps } from "@/utils/types/Apptypes";
import { AIMicIcon, AIPaperclipIcon, AISendIcon } from "../../../assets/Svg/SvgIcons";
import AppButton from "../../ReusableComp/AppButton";
import AppTextInput from "../../ReusableComp/CustomTextInput";

const ChatInputBar = ({ value, onChangeText, onSend, disabled }: ChatInputBarProps) => {
  return (
    <View style={styles.inputArea}>
      <View style={styles.inputWrapper}>
        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Ask anything..."
          multiline
          inputContainerStyle={styles.chatInputContainer}
          containerStyle={styles.chatInputWrapper}
          leftIcon={
            <TouchableOpacity activeOpacity={0.7} style={styles.inputIconButton}>
              <AIPaperclipIcon size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          }
          rightIcon={
            <TouchableOpacity activeOpacity={0.7} style={styles.inputIconButton}>
              <AIMicIcon size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          }
        />
      </View>

      <AppButton
        width={48}
        height={48}
        borderRadius={24}
        backgroundColor={theme.colors.primary}
        icon={<AISendIcon size={22} color={theme.colors.black} />}
        onPress={onSend}
        disabled={disabled}
        style={styles.sendButton}
      />
    </View>
  );
};

export default ChatInputBar;

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 7,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
  },

  inputWrapper: {
    flex: 1,
  },

  chatInputWrapper: {
    marginBottom: 0,
  },

  chatInputContainer: {
    minHeight: 46,
    maxHeight: 90,
    height: "auto",
    borderRadius: 23,
    paddingLeft: 8,
    paddingRight: 7,
    alignItems: "center",
  },

  inputIconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButton: {
    marginBottom: 0,
  },
});
