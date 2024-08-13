import { Button, ImageBackground, Text, TextInput, View, StyleSheet, ImageSourcePropType, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useLoginMutation, useSafeAreaStyle } from "../../utils/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";

const background1 = require("../../assets/images/background1.webp");
const background2 = require("../../assets/images/background2.webp");
const background3 = require("../../assets/images/background3.webp");

const FADE_IN_DURATION = 750;
const FADE_OUT_DURATION = 500;

const fadeIn = (sharedValue: SharedValue<number>, callback?: () => void) => {
  sharedValue.value = withTiming(
    1,
    {
      duration: FADE_IN_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
    () => (callback ? runOnJS(callback)() : undefined)
  );
};

const fadeOut = (sharedValue: SharedValue<number>, callback?: () => void) => {
  sharedValue.value = withTiming(
    0.75,
    {
      duration: FADE_OUT_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    },
    () => (callback ? runOnJS(callback)() : undefined)
  );
};

const getAnimatedStyle = (sharedValue: SharedValue<number>) =>
  useAnimatedStyle(() => {
    return {
      opacity: sharedValue.value,
    };
  });

export default function LoginScreen() {
  const navigation = useNavigation();
  const loginMutation = useLoginMutation();
  const safeAreaStyle = useSafeAreaStyle();
  const backgroundFadeOpacity = useSharedValue(1);
  const animatedStyle = getAnimatedStyle(backgroundFadeOpacity);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [background, setBackground] = useState<ImageSourcePropType>(background1);
  const imageList = [background1, background2, background3];
  const isLoginButtonEnabled = !loginMutation.isLoading && identifier && password;

  useEffect(() => {
    const resetToken = async () => {
      await AsyncStorage.removeItem("token");
    };

    resetToken();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fadeOut(backgroundFadeOpacity, () => {
        setBackground((current) => {
          const index = imageList.indexOf(current);
          return imageList[(index + 1) % imageList.length];
        });
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fadeIn(backgroundFadeOpacity);
  }, [background]);

  const onSignIn = () => {
    if (isLoginButtonEnabled) {
      loginMutation.mutate({ identifier, password });
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ImageBackground source={background} style={styles.container}>
        <View style={[styles.modalContainer, safeAreaStyle]}>
          <View style={styles.modal}>
            <View style={styles.headerContainer}>
              <Pressable onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon={faArrowLeft} size={18} color={COLORS.black} />
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
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  modalContainer: {
    marginHorizontal: 20,
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
    bottom: 0,
    top: 19,
    right: 10,
  },

  hidePasswordButton: {
    position: "absolute",
    bottom: 0,
    top: 18,
    right: 9,
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
