import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import { theme } from "@/utils/theme/Theme";
import type { TopicRowProps } from "@/utils/types/Apptypes";
import { CheckIcon, TopicIcon } from "../../../assets/Svg/SvgIcons";

const RING_SIZE = 46;

// One row in the topics list: icon chip, title/lesson count, and a progress ring
// (a checkmark once completed, otherwise a percentage donut chart).
const TopicRow = ({ item, accentColor, percent, completed, onPress }: TopicRowProps) => {
  const ringColor = completed ? theme.colors.primary : accentColor;

  const pieData = [
    { value: percent, color: ringColor },
    { value: 100 - percent, color: theme.colors.border },
  ];

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.row}>
      <View
        style={[
          styles.iconChip,
          { backgroundColor: `${accentColor}26`, borderColor: `${accentColor}4D` },
        ]}
      >
        <TopicIcon color={accentColor} />
      </View>

      <View style={styles.textCol}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.meta}>{item.totalLessons} Lessons</Text>
      </View>

      <View style={styles.progressWrap}>
        <PieChart
          data={pieData}
          donut
          radius={RING_SIZE / 2}
          innerRadius={RING_SIZE / 2 - 5}
          innerCircleColor={theme.colors.card}
          centerLabelComponent={() =>
            completed ? (
              <CheckIcon color={theme.colors.primary} size={18} />
            ) : (
              <Text style={styles.progressPercentText}>{percent}%</Text>
            )
          }
        />
      </View>
    </TouchableOpacity>
  );
};

export default TopicRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.sm + 2,
    gap: theme.spacing.sm + 2,
  },

  iconChip: {
    width: "16%",
    height: 55,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textCol: {
    flex: 1,
    gap: 2,
  },

  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },

  meta: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.caption,
    fontWeight: "500",
  },

  progressWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercentText: {
    color: theme.colors.text,
    fontSize: 12,
  },
});
