import { RootState } from "@/redux/store";
import { NotificationIcon } from "../../assets/Svg/SvgIcons";
import { theme } from "@/utils/theme/Theme";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const HomeScreenHeaderComp = () => {
  const { currentUser } = useSelector((state: RootState) => state.global);


  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.helloRow}>
          <Text style={styles.hello}>Hello, {currentUser?.fullName} </Text>
        </View>
        <Text style={styles.subtitle}>Let's keep learning every day!</Text>
      </View>
      <NotificationIcon size={24} color={theme.colors.text} />
    </View>
  );
};

export default HomeScreenHeaderComp;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexShrink: 1,
  },
  helloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hello: {
    color: theme.colors.text,
    fontSize: 27,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
});