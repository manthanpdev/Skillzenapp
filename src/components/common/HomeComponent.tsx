import { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import HomeScreenHeaderComp from "./HomeScreenHeadercomp";
import CustomeSearch from "../ReusableComp/CustomeSearch";
import BenefitsSection from "./BenefitsSection";
import CategoriesComp from "./CatogeriesComp";
import { ContinueLearningComp } from "./ContinueLearningCompTwo";

const HomeComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const measuredHeight = useSharedValue(0);
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
      if (h > 0 && Math.abs(measuredHeight.value - h) > 1) {
        measuredHeight.value = h;
      }
    },
    [],
  );

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

      {/* Moved outside the collapsible/height-locked wrapper — always renders,
          never subject to measuredHeight clipping */}
      <BenefitsSection />

      <Animated.View
        style={collapsibleStyle}
        pointerEvents={isSearching ? "none" : "auto"}
      >
        <View onLayout={onMeasureLayout}>
          <ContinueLearningComp margintop={isSearching} scrollY={scrollY} />
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

  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});