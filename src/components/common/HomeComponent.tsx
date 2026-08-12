import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
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

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  // ---- smooth collapse logic ----
  const measuredHeight = useSharedValue(0);
  const collapseProgress = useSharedValue(1); // 1 = fully shown, 0 = fully collapsed

  useEffect(() => {
    collapseProgress.value = withTiming(isSearching ? 0 : 1, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSearching]);

  const collapsibleStyle = useAnimatedStyle(() => {
    const height =
      measuredHeight.value > 0
        ? measuredHeight.value * collapseProgress.value
        : undefined;

    return {
      opacity: collapseProgress.value,
      height,
      overflow: "hidden",
    };
  });

  const onMeasureLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      const h = e.nativeEvent.layout.height;
      // only capture once (or update if content height actually changes)
      if (h > 0 && Math.abs(measuredHeight.value - h) > 1) {
        measuredHeight.value = h;
      }
    },
    []
  );
  // --------------------------------

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <HomeScreenHeaderComp />

      <CustomeSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        onFocusChange={setIsSearchFocused}
      />

      <Animated.View style={collapsibleStyle} pointerEvents={isSearching ? "none" : "auto"}>
        <View onLayout={onMeasureLayout}>
          <BenefitsSection />
          <ContinueLearningComp margintop={isSearching} scrollY={scrollY} />
        </View>
      </Animated.View>

      {categoriesLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <Animated.View entering={FadeIn.duration(200)}>
          <CategoriesComp ismarginTop={isSearching} searchQuery={searchQuery} />
        </Animated.View>
      )}
    </Animated.ScrollView>
  );
};

export default HomeComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 15,
    // paddingBottom: 24,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});