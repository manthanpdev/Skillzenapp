import { ICON_PALETTE, theme } from "@/utils/theme/Theme";
import { router } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { BackIcon, CheckIcon, TopicIcon } from "../../assets/Svg/SvgIcons";
import { DUMMY_TOPICS } from "../../utils/constants/dummyTopicks";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../ReusableComp/AppButton";

const RING_SIZE = 46;

// dummy progress just to vary the UI — 0, partial, and completed states
const getDummyProgress = (index: number) => {
  const mod = index % 4;
  if (mod === 0) return { percent: 100, completed: true };
  if (mod === 1) return { percent: 0, completed: false };
  if (mod === 2) return { percent: 40, completed: false };
  return { percent: 75, completed: false };
};

const TopickComp = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <AppButton
          icon={<BackIcon color={theme.colors.text} />}
          onPress={() => router.back()}
          backgroundColor={theme.colors.card}
          width={38}
          height={38}
          borderRadius={theme.radius.sm}
          style={styles.backButton}
          hitSlop={10}
        />
        <Text style={styles.headerTitle}>React Native CLI</Text>
        <Text style={styles.headerSubtitle}>Choose a topic</Text>
      </View>

      <FlatList
        data={DUMMY_TOPICS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const accent = ICON_PALETTE[index % ICON_PALETTE.length];
          const { percent, completed } = getDummyProgress(index);
          const ringColor = completed ? theme.colors.primary : accent;

          const pieData = [
            { value: percent, color: ringColor },
            { value: 100 - percent, color: theme.colors.border },
          ];

          return (
            <TouchableOpacity
              onPress={() => router.navigate("/LessonScreen")}
              style={styles.row}
            >
              <View
                style={[
                  styles.iconChip,
                  {
                    backgroundColor: `${accent}26`,
                    borderColor: `${accent}4D`,
                  },
                ]}
              >
                <TopicIcon color={accent} />
              </View>

              <View style={styles.textCol}>
                <Text numberOfLines={1} style={styles.title}>
                  {item.title}
                </Text>
                <Text style={styles.meta}>{item.totalLessons}lessons</Text>
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
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TopickComp;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
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
  listContent: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 60,
    gap: theme.spacing.sm,
  },
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