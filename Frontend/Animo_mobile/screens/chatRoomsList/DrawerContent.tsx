import { Image, Pressable, StyleSheet, View, Text } from "react-native";
import { useUser } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconAvatar from "../../components/IconAvatar";
import { faArrowRightFromBracket, faComment, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import COLORS from "../../utils/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const animoLogo = require("../../assets/images/animo-logo.png");

export default function DrawerContent() {
  const user = useUser();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const containerStyle = StyleSheet.flatten([
    styles.container,
    { paddingTop: styles.container.padding + insets.top, paddingBottom: styles.container.padding + insets.bottom },
  ]);

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const onProfilePress = () => {
    closeDrawer();
    navigation.navigate("UserProfile", { userId: user.userId });
  };

  const onNewChatPress = () => {
    closeDrawer();
    navigation.navigate("NewChat");
  };

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    user.refetch();
  };

  return (
    <View style={containerStyle}>
      <View style={styles.row}>
        <Image source={animoLogo} resizeMode={"contain"} style={styles.logo} />
        <Text style={[styles.rowText, styles.logoText]}>Animo</Text>
      </View>
      <Pressable onPress={onProfilePress} style={styles.row}>
        <IconAvatar icon={faUser} size={32} />
        <Text style={styles.rowText}>
          {user.firstName} {user.lastName}
        </Text>
      </Pressable>
      <View style={styles.separator} />
      <Pressable onPress={onNewChatPress} style={styles.row}>
        <IconAvatar icon={faComment} size={32} />
        <Text style={styles.rowText}>New chat</Text>
      </Pressable>
      <View style={styles.bottomRows}>
        <View style={styles.row}>
          <FontAwesomeIcon icon={faGear} size={26} style={styles.icon} />
          <Text style={styles.rowText}>Settings</Text>
        </View>
        <Pressable onPress={onLogout} style={styles.row}>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            size={26}
            style={StyleSheet.flatten([styles.icon, styles.logoutIcon])}
          />
          <Text style={styles.rowText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    gap: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 32,
  },

  logo: {
    width: 32,
    height: 32,
  },

  logoText: {
    color: COLORS.blue600,
    fontWeight: "600",
  },

  rowText: {
    color: COLORS.gray600,
    fontSize: 16,
  },

  separator: {
    borderColor: COLORS.gray200,
    borderBottomWidth: 1,
    borderRadius: 100,
  },

  bottomRows: {
    marginTop: "auto",
    gap: 18,
  },

  icon: {
    color: COLORS.gray500,
  },

  logoutIcon: {
    transform: [{ scaleX: -1 }],
  },
});
