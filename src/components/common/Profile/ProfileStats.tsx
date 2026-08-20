import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/utils/theme/Theme";

const ProfileStats = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Lessons</Text>
        <Text style={styles.statValue}>0</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Tasks</Text>
        <Text style={styles.statValue}>0</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Quizzes</Text>
        <Text style={styles.statValue}>0</Text>
      </View>
    </View>
  );
};

export default ProfileStats;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 17,
    paddingVertical: 17,
    marginBottom: 14,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    color: theme.colors.muted,
    fontSize: 12,
    marginBottom: 6,
  },

  statValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },

  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: theme.colors.divider,
  },
});
