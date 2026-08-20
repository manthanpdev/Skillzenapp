import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { TopicsHeaderProps } from "@/utils/types/Apptypes";
import { BackIcon } from "../../../assets/Svg/SvgIcons";
import AppButton from "../../ReusableComp/AppButton";

const TopicsHeader = ({ title, onBack }: TopicsHeaderProps) => {
  return (
    <View style={styles.header}>
      <AppButton
        icon={<BackIcon color={theme.colors.text} />}
        onPress={onBack}
        backgroundColor={theme.colors.card}
        width={38}
        height={38}
        borderRadius={theme.radius.sm}
        style={styles.backButton}
        hitSlop={10}
      />

      <Text style={styles.headerTitle}>{title}</Text>

      <Text style={styles.headerSubtitle}>Choose a topic</Text>
    </View>
  );
};

export default TopicsHeader;

const styles = StyleSheet.create({
  header: {
    marginVertical: 10,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
  },

  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  headerSubtitle: {
    color: theme.colors.muted,
    fontSize: 17,
    fontWeight: "400",
    marginTop: 1,
    textAlign: "center",
  },
});
