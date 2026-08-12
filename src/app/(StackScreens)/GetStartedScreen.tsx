import GetStartedAnimation from "@/components/common/GetStartedcomp";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStartedScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GetStartedAnimation />
    </SafeAreaView>
  );
};

export default GetStartedScreen;