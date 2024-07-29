import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
