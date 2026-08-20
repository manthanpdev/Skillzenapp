import { useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Carousel } from "react-native-reanimated-carousel";
import BenefitCard from "./BenefitCard";
import { BenefitItem } from "@/utils/types/Apptypes";
import { benefitsConfig } from "@/utils/constants/benefitsConfig";


const AUTO_PLAY_INTERVAL = 4000;
// const TRANSITION_DURATION = 4000;
const CARD_HEIGHT = 76;

const CARD_HORIZONTAL_MARGIN = 4 * 2;

const BenefitsSection = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    setContainerWidth((prev) => (prev === width ? prev : width));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: BenefitItem }) => (
      <BenefitCard
        title={item.title}
        description={item.description}
        icon={item.icon}
        cardWidth={containerWidth - CARD_HORIZONTAL_MARGIN}
      />
    ),
    [containerWidth],
  );

  if (benefitsConfig.length === 0) return null;

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      {containerWidth > 0 && (
        <Carousel<BenefitItem>
          data={benefitsConfig}
          renderItem={renderItem}
          style={{ width: containerWidth, height: CARD_HEIGHT }}
          loop
          autoplay
          autoplayInterval={AUTO_PLAY_INTERVAL}
          // animation={{ type: "timing", duration: TRANSITION_DURATION }}
        />
      )}
    </View>
  );
};

export default BenefitsSection;

const styles = StyleSheet.create({
  container: { marginTop: 15 },
});