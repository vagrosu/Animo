import { useUser } from "../context/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/register/RegisterScreen";
import LandingScreen from "../screens/landing/LandingScreen";
import ChatRoomScreen from "../screens/chatRoom/ChatRoomScreen";
import ChatRoomsListDrawer from "./ChatRoomsListDrawer";
import ChatRoomInfoScreen from "../screens/chatRoomInfo/ChatRoomInfoScreen";
import UserProfileScreen from "../screens/userProfile/UserProfileScreen";
import SelfieConsentProtectedContext from "../context/SelfieConsentProtectedContext/SelfieConsentProtectedContext";
import NewChatScreen from "../screens/newChat/NewChatScreen";

const Stack = createStackNavigator();

export default function AppNavigation() {
  const { isAuthenticated } = useUser();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <SelfieConsentProtectedContext>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="ChatRoomsListDrawer" component={ChatRoomsListDrawer} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
            <Stack.Screen name="ChatRoomInfo" component={ChatRoomInfoScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="NewChat" component={NewChatScreen} />
          </Stack.Navigator>
        </SelfieConsentProtectedContext>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
