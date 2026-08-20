import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { theme } from "@/utils/theme/Theme";
import type { SuggestedQuestionsProps } from "@/utils/types/Apptypes";
import { AISparkleIcon } from "../../../assets/Svg/SvgIcons";
import { suggestedQuestions } from "@/utils/constants/dummyTopicks";

// Shown only before the first message is sent (empty chat state).
const SuggestedQuestions = ({ onSelectQuestion }: SuggestedQuestionsProps) => {
  return (
    <>
      <View style={styles.suggestedHeader}>
        <View style={styles.sectionTitleContainer}>
          <AISparkleIcon size={25} color={theme.colors.primary} />

          <Text style={styles.sectionTitle}>Suggested Questions</Text>
        </View>

        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionList}
      >
        {suggestedQuestions.map((question) => (
          <TouchableOpacity
            key={question}
            activeOpacity={0.75}
            style={styles.suggestionPill}
            onPress={() => onSelectQuestion(question)}
          >
            <Text style={styles.suggestionText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default SuggestedQuestions;

const styles = StyleSheet.create({
  suggestedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  seeAll: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  suggestionList: {
    gap: 8,
    paddingBottom: 18,
  },

  suggestionPill: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  suggestionText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});
