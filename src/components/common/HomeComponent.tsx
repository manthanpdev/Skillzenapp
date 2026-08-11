import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { fetchCategories } from "@/redux/actions";
import HomeScreenHeaderComp from "./HomeScreenHeadercomp";
import CustomeSearch from "../ReusableComp/CustomeSearch";
import BenefitsSection from "./BenefitsSection";
import CategoriesComp from "./CatogeriesComp";
import { ContinueLearningComp } from "./ContinueLearningCompTwo";
import { theme } from "../../utils/theme/Theme";

const HomeComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const isSearching = isSearchFocused || searchQuery.length > 0;

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchFocused(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        console.log("❌ Failed to load categories:", error);
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <HomeScreenHeaderComp />

      <CustomeSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        onFocusChange={setIsSearchFocused}
      />

      {!isSearching && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(200)}
        >
          <BenefitsSection />
        </Animated.View>
      )}

      <ContinueLearningComp />

      {categoriesLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <Animated.View entering={FadeIn.duration(200)}>
          <CategoriesComp searchQuery={searchQuery} />
        </Animated.View>
      )}
    </View>
  );
};

export default HomeComponent;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
