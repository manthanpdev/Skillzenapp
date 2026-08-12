
import { theme } from "@/utils/theme/Theme";
import { BenefitCardProps } from "@/utils/types/Apptypes";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const BenefitCard = memo(
  ({ title, description, icon: Icon, cardWidth }: BenefitCardProps) => (
    <View style={[styles.banner, { width: cardWidth }]}>
      <Icon size={22} color={theme.colors.primary} strokeWidth={1.75} />
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
    </View>
  ),
);
BenefitCard.displayName = "BenefitCard";

export default BenefitCard;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
  },
  textCol: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 13.5,
    fontWeight: "600",
    marginBottom: 1,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 15,
  },
});