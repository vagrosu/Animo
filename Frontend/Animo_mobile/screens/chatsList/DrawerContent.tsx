import { Button, StyleSheet, View } from "react-native";
import { useUser } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DrawerContent() {
  const { refetch } = useUser();

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    refetch();
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
