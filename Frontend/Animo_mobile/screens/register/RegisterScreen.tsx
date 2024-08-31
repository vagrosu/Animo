import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedImageBackground from "../../components/AnimatedImageBackground";
import COLORS from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { useLoginMutation, useSafeAreaStyle } from "../../utils/hooks";
import { useState } from "react";
import { useMutation } from "react-query";
import { AuthenticationRegisterResponseType } from "../../types/api/responses";
import { AxiosError, isAxiosError } from "axios";
import { AuthentificationRegisterQueryType } from "../../types/api/queries";
import Toast from "react-native-toast-message";
import { createApiInstance } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const safeAreaStyle = useSafeAreaStyle(styles.modalContainer);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();
  const mutation = useMutation<AuthenticationRegisterResponseType, Error | AxiosError, AuthentificationRegisterQueryType>({
    mutationFn: async (query) => {
      const api = await createApiInstance();
      return api
        .post<AuthenticationRegisterResponseType>("Authentication/register", {
          username: query.username,
          firstName: query.firstName,
          lastName: query.lastName,
          email: query.email,
          phoneNumber: query.phoneNumber,
          password: query.password,
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      loginMutation.mutate({
        identifier: email,
        password: password,
      });
    },
    onError: (error) => {
      if (isAxiosError(error) && typeof error.response?.data === "string") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.response.data,
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
  const isRegisterButtonEnabled = !!(
    !mutation.isLoading &&
    username &&
    firstName &&
    lastName &&
    email &&
    phoneNumber &&
    password &&
    confirmPassword
  );

  const onSignUp = () => {
    if (isRegisterButtonEnabled) {
      if (password !== confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Passwords do not match",
        });
        return;
      }

      mutation.mutate({
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
    }
  };

  const goToLanding = () => {
    navigation.navigate("Landing");
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <AnimatedImageBackground style={styles.animatedBackground}>
      <KeyboardAvoidingView behavior="position" style={safeAreaStyle}>
        <View style={styles.modal}>
          <View style={styles.headerContainer}>
            <Pressable onPress={goToLanding}>
              <FontAwesomeIcon icon={faChevronLeft} size={18} color={COLORS.black} />
            </Pressable>
            <Text style={styles.title}>Sign up</Text>
          </View>
          <Text style={styles.subtitle}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            textContentType="username"
            autoCapitalize={"none"}
          />
          <View style={styles.namesInputContainer}>
            <View style={styles.nameInputContainer}>
              <Text style={styles.subtitle}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                textContentType="givenName"
                autoCapitalize={"none"}
              />
            </View>
            <View style={styles.nameInputContainer}>
              <Text style={styles.subtitle}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                textContentType="familyName"
                autoCapitalize={"none"}
              />
            </View>
          </View>
          <Text style={styles.subtitle}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            textContentType="emailAddress"
            autoCapitalize={"none"}
          />
          <Text style={styles.subtitle}>Phone number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            textContentType="telephoneNumber"
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
          <Text style={styles.subtitle}>Confirm password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[styles.input, styles.passwordInput]}
            textContentType="password"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={onSignUp}>
            <Text style={[styles.signInButton, isRegisterButtonEnabled ? styles.signInButtonEnabled : null]}>
              Create account
            </Text>
          </Pressable>
          <View style={styles.footerContainer}>
            <Text style={styles.subtitle}>Already have an account?</Text>
            <Pressable onPress={goToLogin}>
              <Text style={[styles.subtitle, styles.toSignUpButton]}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AnimatedImageBackground>
  );
}

const styles = StyleSheet.create({
  animatedBackground: {
    justifyContent: "center",
  },

  modalContainer: {
    paddingHorizontal: 18,
  },

  modal: {
    paddingHorizontal: 16,
    paddingVertical: 20,
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
    marginTop: 16,
    fontWeight: "300",
  },

  input: {
    width: "100%",
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 12,
  },

  namesInputContainer: {
    flexDirection: "row",
    gap: 8,
  },

  nameInputContainer: {
    flex: 1,
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
    marginTop: 24,
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
