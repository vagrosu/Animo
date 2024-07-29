import { createDrawerNavigator } from "@react-navigation/drawer";
import ChatsListScreen from "../screens/chatsList/ChatsListScreen";
import DrawerContent from "../screens/chatsList/DrawerContent";

export const Drawer = createDrawerNavigator();

export function ChatsListDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen name="ChatsList" component={ChatsListScreen} />
    </Drawer.Navigator>
  );
}
