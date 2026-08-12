import HomeComponent from "@/components/common/HomeComponent";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

const index = () => {


  return (
    <SafeAreaView style={{ flex: 1 }}  edges={["top"]} >
      <HomeComponent />
    </SafeAreaView>
  );
};

export default index;
