import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButtonProp } from "../../utils/types/Apptypes";
import { theme } from "../../utils/theme/Theme";
import AppActivityIndicator from "./AppActivityIndicator";

const AppButton = ({
  title,
  loadingTitle,
  loading = false,
  onPress,
  width = "100%",
  height = 52,
  backgroundColor = theme.colors.primary,
  textColor = theme.colors.background,
  borderRadius = 9,
  fontSize = 20,
  icon,
  iconPosition = "right",
  disabled = false,
  style,
  textStyle,
  fontweight = "800",
  borderwidth,
  bordercolor,
  hitSlop,
}: AppButtonProp) => {
  const isDisabled = disabled || loading;

  const resolvedIcon = loading ? (
    <AppActivityIndicator size="small" color={textColor} />
  ) : (
    icon
  );

  const resolvedTitle = loading ? (loadingTitle ?? title) : title;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        styles.button,
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          borderWidth: borderwidth,
          borderColor: bordercolor,
          opacity: pressed || isDisabled ? 0.75 : 1,
        },
        style,
      ]}
    >
      {resolvedIcon && iconPosition === "left" && (
        <View style={styles.iconContainer}>{resolvedIcon}</View>
      )}

      {resolvedTitle ? (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize,
              fontWeight: fontweight,
            },
            textStyle,
          ]}
        >
          {resolvedTitle}
        </Text>
      ) : null}

      {resolvedIcon && iconPosition === "right" && (
        <View style={styles.iconContainer}>{resolvedIcon}</View>
      )}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  text: {
    textAlign: "center",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});