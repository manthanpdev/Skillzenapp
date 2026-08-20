import "../config/firebaseConfig";
import "../config/firebaseAuth";
import {  Stack } from "expo-router";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StatusBarComponent from "../components/common/Statusbar/Statusbar";
import { theme } from "../utils/theme/Theme";
import { store } from "../redux/store";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBarComponent />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;