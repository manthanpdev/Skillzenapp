import GetStartedAnimation from "@/components/common/GetStartedcomp";
import { SafeAreaView } from "react-native-safe-area-context";

import { StyleSheet } from "react-native";

const GetStartedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <GetStartedAnimation />
    </SafeAreaView>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
