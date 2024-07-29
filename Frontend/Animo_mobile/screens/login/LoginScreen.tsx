import { Button, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useLoginMutation } from "../../utils/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const loginMutation = useLoginMutation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const resetToken = async () => {
      await AsyncStorage.removeItem("token");
    };

    resetToken();
  }, []);

  return (
    <View>
      <TextInput placeholder="Username or input" onChangeText={setIdentifier} textContentType="emailAddress" autoCapitalize={"none"} />
      <TextInput placeholder="Password" onChangeText={setPassword} textContentType="password" secureTextEntry={!showPassword} />
      <Button title="Show password" onPress={() => setShowPassword(!showPassword)} />
      <Button title="Login" onPress={() => loginMutation.mutate({ identifier, password })} />
    </View>
  );
}
