import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { AppButtonProp } from "../../utils/types/Apptypes";
import { theme } from "../../utils/theme/Theme";
import AppActivityIndicator from "./AppActivityIndicator";
import React from "react";

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

 const handlePress = () => {
  if (isDisabled) return;
  onPress?.();
};

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      hitSlop={hitSlop}
      style={[
        styles.base,
        {
          height,
          width:
            width === "auto"
              ? undefined
              : ((width as number | `${number}%`) ?? "100%"),
          backgroundColor,
          borderRadius,
          borderWidth: borderwidth,
          borderColor: bordercolor,
          opacity: isDisabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {resolvedIcon && iconPosition === "left" && resolvedIcon}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize,
            fontWeight: fontweight,
            marginHorizontal: resolvedIcon ? 8 : 0,
          },
          textStyle,
        ]}
      >
        {resolvedTitle}
      </Text>
      {resolvedIcon && iconPosition === "right" && resolvedIcon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});

export default React.memo(AppButton);
