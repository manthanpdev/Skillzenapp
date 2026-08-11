import { StyleSheet, View } from "react-native";
import SplashScreen from "./(StackScreens)/SplashScreen";

export default function Index() {
  return (
    <View style={styles.container}>
      <SplashScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
