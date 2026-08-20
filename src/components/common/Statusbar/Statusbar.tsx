import { StatusBar } from "react-native";

const StatusBarComponent = () => {
  
  return (
    <>
      <StatusBar
        // backgroundColor="transparent"
        backgroundColor="#0B1020"
        translucent
        barStyle={"default"}
      />
      {/* <View style={{ height: insets.top, backgroundColor: "#0B1020" }} /> */}
    </>
  );
};

export default StatusBarComponent;