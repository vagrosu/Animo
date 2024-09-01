import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useSafeAreaStyle } from "../../utils/hooks";
import COLORS from "../../utils/colors";

const animoLogo = require("../../assets/images/animo-logo.png");

export default function LandingScreen() {
  const navigation = useNavigation();
  const safeAreaStyle = useSafeAreaStyle(styles.container);

  const onLoginPress = () => {
    navigation.navigate("Login");
  };

  const onRegisterPress = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={[styles.page]}>
      <LinearGradient
        colors={[
          "#2563eb",
          "#2870f0",
          "#317df3",
          "#3d89f6",
          "#4b95f8",
          "#62a0f8",
          "#76aaf8",
          "#89b5f7",
          "#a3c1f4",
          "#bacef1",
          "#e5e7eb",
        ]}
        style={styles.background}
      />
      <View style={safeAreaStyle}>
        <Text style={styles.pitchText}>We make emotions </Text>
        <Text style={styles.pitchText}>clear and simple</Text>
        <Image style={styles.animoLogo} source={animoLogo} />
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={onLoginPress}
            style={({ pressed }) => [styles.loginButton, styles.button, pressed && styles.loginuttonPressed]}
          >
            <Text style={styles.loginButtonText}>Sign in</Text>
          </Pressable>
          <Pressable
            onPress={onRegisterPress}
            style={({ pressed }) => [styles.registerButton, styles.button, pressed && styles.registerButtonPressed]}
          >
            <Text style={styles.registerButtonText}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  animoLogo: {
    width: "70%",
    resizeMode: "contain",
  },

  pitchText: {
    textAlign: "center",
    color: COLORS.gray100,
    fontWeight: "bold",
    fontSize: 36,
  },

  buttonsContainer: {
    gap: 20,
    width: "100%",
  },

  button: {
    paddingVertical: 14,
    borderWidth: 1.5,
    borderRadius: 16,
  },

  loginButton: {
    borderColor: COLORS.blue600,
  },

  loginuttonPressed: {
    borderColor: COLORS.blue800,
    opacity: 0.5,
  },

  loginButtonText: {
    textAlign: "center",
    color: COLORS.blue600,
    fontSize: 16,
  },

  registerButton: {
    backgroundColor: COLORS.blue600,
    borderColor: COLORS.blue600,
  },

  registerButtonPressed: {
    backgroundColor: COLORS.blue800,
    borderColor: COLORS.blue800,
  },

  registerButtonText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 16,
  },
});
