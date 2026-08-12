import React, { memo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "@/utils/theme/Theme";
import { AppActivityIndicatorProps } from "@/utils/types/Apptypes";

const AppActivityIndicator = ({
  size = "small",
  color = theme.colors.primary,
  fullscreen = false,
  style,
}: AppActivityIndicatorProps) => {
  if (fullscreen) {
    return (
      <View style={[styles.fullscreen, style]}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} style={style} />;
};

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    zIndex: 999,
  },
});

export default memo(AppActivityIndicator);