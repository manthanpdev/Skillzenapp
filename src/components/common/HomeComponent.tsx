import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import HomeScreenHeaderComp from "./HomeScreenHeadercomp";
import CustomeSearch from "../ReusableComp/CustomeSearch";
import BenefitsSection from "./BenefitsSection";
import CategoriesComp from "./CatogeriesComp";
import { ContinueLearningComp } from "./ContinueLearningCompTwo";

const HomeComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const isSearching = isSearchFocused || searchQuery.length > 0;

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchFocused(false);
  }, []);

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

      <Animated.View entering={FadeIn.duration(200)}>
        <CategoriesComp searchQuery={searchQuery} />
      </Animated.View>
    </View>
  );
};

export default HomeComponent;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
});
