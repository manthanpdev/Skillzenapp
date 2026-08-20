import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { WelcomeCardProps } from "@/utils/types/Apptypes";
import { AIRobotIcon } from "../../../assets/Svg/SvgIcons";

// Shown only before the first message is sent (empty chat state).
const WelcomeCard = ({ fullName }: WelcomeCardProps) => {
  return (
    <View style={styles.welcomeCard}>
      <View style={styles.robotContainer}>
        <AIRobotIcon size={42} color={theme.colors.primary} />
      </View>

      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>
          Hi, <Text style={styles.highlight}>{fullName} !</Text> 👋
        </Text>

        <Text style={styles.welcomeDescription}>
          Ask me anything about React Native,{"\n"}
          JavaScript, TypeScript and more.
        </Text>
      </View>
    </View>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  welcomeCard: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 20,
  },

  robotContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },

  highlight: {
    color: theme.colors.primary,
  },

  welcomeDescription: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});
