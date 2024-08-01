import { useUser } from "../context/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/register/RegisterScreen";
import LandingScreen from "../screens/landing/LandingScreen";
import ChatRoomScreen from "../screens/chatRoom/ChatRoomScreen";
import ChatRoomsListDrawer from "./ChatRoomsListDrawer";
import ChatRoomInfoScreen from "../screens/chatRoomInfo/ChatRoomInfoScreen";

const Stack = createStackNavigator();

export default function AppNavigation() {
  const { isAuthenticated } = useUser();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="ChatRoomsListDrawer" component={ChatRoomsListDrawer} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="ChatRoomInfo" component={ChatRoomInfoScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
