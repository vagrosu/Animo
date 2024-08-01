import { createDrawerNavigator } from "@react-navigation/drawer";
import ChatRoomsListScreen from "../screens/chatRoomsList/ChatRoomsListScreen";
import DrawerContent from "../screens/chatRoomsList/DrawerContent";

export const Drawer = createDrawerNavigator();

export default function ChatRoomsListDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen name="ChatRoomsList" component={ChatRoomsListScreen} />
    </Drawer.Navigator>
  );
}
