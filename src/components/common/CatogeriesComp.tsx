// CategoriesComp.tsx
import { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../../utils/theme/Theme";
import { CategoriesCompProps, Category } from "../../utils/types/Apptypes";
import { router } from "expo-router";
import CategoryCard from "./CategoryCard";
import { setSelectedCategory } from "@/redux/reducers";
import { fetchTopicsByCategory } from "@/redux/actions";
import { AppDispatch, RootState } from "@/redux/store";

const SECTION_ENTRY_DELAY = 0;

const CategoriesComp = ({
  searchQuery = "",
  ismarginTop,
}: CategoriesCompProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories } = useSelector((state: RootState) => state.global);
    const handlePress = async (category: Category) => {
      dispatch(setSelectedCategory(category.id));

      router.navigate("/(StackScreens)/TopickScreen");

      try {
        await dispatch(fetchTopicsByCategory(category.id)).unwrap();
      } catch (error) {
        console.log("Error loading topics:", error);
      }
    };
    const filteredCategories = categories.filter(
      (cat: Category) =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const isEmpty = searchQuery.length > 0 && filteredCategories.length === 0;

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            {filteredCategories.map((cat: Category, i: number) => (
              <CategoryCard
                key={cat.id}
                item={cat}
                index={i}
                onPress={() => handlePress(cat)}
              />
            ))}
          </ScrollView>
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
    marginBottom: 10,
    marginTop: 5,
  },

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
