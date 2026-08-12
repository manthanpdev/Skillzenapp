// CategoriesComp.tsx
import { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { theme } from "../../utils/theme/Theme";
import { CategoriesCompProps, Category } from "../../utils/types/Apptypes";
import { router } from "expo-router";
import CategoryCard from "./CategoryCard";
import { RootState } from "@/redux/store";

const SECTION_ENTRY_DELAY = 0;

const CategoriesComp = ({
  searchQuery = "",
  ismarginTop,
}: CategoriesCompProps) => {
  const { categories } = useSelector((state: RootState) => state.global);

  const handlePress = useCallback((_c?: Category) => {
    router.navigate("/(StackScreens)/TopickScreen");
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (cat: Category) =>
        cat?.title?.toLowerCase().includes(q) ||
        cat?.description?.toLowerCase().includes(q),
    );
  }, [categories, searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;
  const isEmpty = isSearchActive && filteredCategories.length === 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(
        searchQuery ? 0 : SECTION_ENTRY_DELAY,
      ).duration(300)}
    >
      <Text style={[styles.heading, { marginTop: ismarginTop ? 12 : 0 }]}>
        Categories
      </Text>

      {isEmpty ? (
        <Animated.View
          entering={FadeInDown.duration(250)}
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyTitle}>No categories found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching for something else
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.listContainer}>
          {filteredCategories.map((cat: Category, i: number) => (
            <CategoryCard
              key={cat.id}
              item={cat}
              index={i}
              onPress={handlePress}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export default CategoriesComp;

const styles = StyleSheet.create({
  heading: {
    color: theme.colors.text,
    fontSize: theme.fontSize.title,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  listContainer: {},
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl ?? 40,
    gap: 4,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: theme.colors.muted,
    fontSize: theme.fontSize.body,
  },
});
