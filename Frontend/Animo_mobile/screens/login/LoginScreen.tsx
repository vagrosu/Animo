import { Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useLoginMutation, useSafeAreaStyle } from "../../utils/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import AnimatedImageBackground from "../../components/AnimatedImageBackground";

export default function LoginScreen() {
  const navigation = useNavigation();
  const loginMutation = useLoginMutation();
  const safeAreaStyle = useSafeAreaStyle(styles.modalContainer);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isLoginButtonEnabled = !loginMutation.isLoading && identifier && password;

  useEffect(() => {
    const resetToken = async () => {
      await AsyncStorage.removeItem("token");
    };

    resetToken();
  }, []);

  const onSignIn = () => {
    if (isLoginButtonEnabled) {
      loginMutation.mutate({ identifier, password });
    }
  };

  const goToLanding = () => {
    navigation.navigate("Landing");
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <AnimatedImageBackground style={styles.animatedBackground}>
      <View style={safeAreaStyle}>
        <View style={styles.modal}>
          <View style={styles.headerContainer}>
            <Pressable onPress={goToLanding}>
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={COLORS.black} />
            </Pressable>
            <Text style={styles.title}>Sign in</Text>
          </View>
          <Text style={styles.subtitle}>Username or email</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
            textContentType="emailAddress"
            autoCapitalize={"none"}
          />
          <Text style={styles.subtitle}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[styles.input, styles.passwordInput]}
              textContentType="password"
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={showPassword ? styles.hidePasswordButton : styles.showPasswordButton}
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                size={showPassword ? 20 : 18}
                color={COLORS.gray500}
              />
            </Pressable>
          </View>
          <Pressable onPress={onSignIn}>
            <Text style={[styles.signInButton, isLoginButtonEnabled ? styles.signInButtonEnabled : null]}>Sign in</Text>
          </Pressable>
          <View style={styles.footerContainer}>
            <Text style={styles.subtitle}>Don't have an account?</Text>
            <Pressable onPress={goToRegister}>
              <Text style={[styles.subtitle, styles.toSignUpButton]}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AnimatedImageBackground>
  );
}

const styles = StyleSheet.create({
  animatedBackground: {
    justifyContent: "center",
  },

  modalContainer: {
    paddingHorizontal: 20,
  },

  modal: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: COLORS.white,
    borderRadius: 24,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 24,
    lineHeight: 32,
  },

  subtitle: {
    color: COLORS.gray500,
    marginTop: 26,
    fontWeight: "300",
  },

  input: {
    width: "100%",
    height: 38,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 12,
  },

  passwordInputContainer: {
    flexDirection: "row",
  },

  passwordInput: {
    paddingRight: 36,
  },

  showPasswordButton: {
    position: "absolute",
    padding: 10,
    bottom: 0,
    right: 0,
  },

  hidePasswordButton: {
    position: "absolute",
    padding: 9,
    bottom: 0,
    right: 0,
  },

  signInButton: {
    marginTop: 32,
    textAlign: "center",
    color: COLORS.gray50,
    backgroundColor: COLORS.gray300,
    padding: 12,
    borderRadius: 20,
    overflow: "hidden",
  },

  signInButtonEnabled: {
    backgroundColor: COLORS.blue600,
  },

  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 6,
    marginLeft: 4,
    gap: 4,
  },

  toSignUpButton: {
    color: COLORS.blue600,
  },
});
