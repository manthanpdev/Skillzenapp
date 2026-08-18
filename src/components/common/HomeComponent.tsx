import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  Easing,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import HomeScreenHeaderComp from "./HomeScreenHeadercomp";
import CustomeSearch from "../ReusableComp/CustomeSearch";
import BenefitsSection from "./BenefitsSection";
import CategoriesComp from "./CatogeriesComp";
import { ContinueLearningComp } from "./ContinueLearningCompTwo";

const COLLAPSE_RANGE = 140;

const HomeComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const continueHeight = useSharedValue(0);
  const collapseProgress = useSharedValue(1);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const isSearching = isSearchFocused || searchQuery.length > 0;

  useEffect(() => {
    collapseProgress.value = withTiming(isSearching ? 0 : 1, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSearching]);

  const continueLayoutStyle = useAnimatedStyle(() => {
    if (continueHeight.value <= 0) {
      return {};
    }

    const scrollHeight = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE],
      [continueHeight.value, 0],
      Extrapolation.CLAMP,
    );

    const finalHeight = scrollHeight * collapseProgress.value;

    const scrollMarginBottom = interpolate(
      scrollY.value,
      [0, COLLAPSE_RANGE],
      [16, 0],
      Extrapolation.CLAMP,
    );

    const finalMarginBottom = scrollMarginBottom * collapseProgress.value;

    return {
      height: finalHeight,
      marginBottom: finalMarginBottom,
      overflow: "hidden",
    };
  });

  const handleContinueHeightChange = useCallback((height: number) => {
    if (height > 0) {
      continueHeight.value = height;
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchFocused(false);
  }, []);

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

      <BenefitsSection />

      <Animated.View
        style={continueLayoutStyle}
        pointerEvents={isSearching ? "none" : "auto"}
      >
        <View style={styles.continueContent}>
          <ContinueLearningComp
            margintop={isSearching}
            scrollY={scrollY}
            onHeightChange={handleContinueHeightChange}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(200)}>
        <CategoriesComp ismarginTop={isSearching} searchQuery={searchQuery} />
      </Animated.View>
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
  },

  continueContent: {
    width: "100%",
  },

  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
