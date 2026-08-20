import HomeComponent from "@/components/common/HomeComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

const index = () => {
  return (
    <SafeAreaView style={styles.constainer} edges={["top"]}>
      <HomeComponent />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    paddingTop: 10,
  },
});