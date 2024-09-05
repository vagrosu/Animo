import { LogBox, Platform, StyleSheet, StatusBar } from "react-native";
import AppNavigation from "./navigation/AppNavigation";
import { QueryClient, QueryClientProvider } from "react-query";
import UserContextProvider from "./context/UserContext";
import ToastProvider from "./context/ToastProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { EventProvider } from "react-native-outside-press";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

LogBox.ignoreLogs(["AxiosError: Request failed with status code 401", "Possible unhandled promise rejection (id: "]);

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <ActionSheetProvider>
      <EventProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle={"default"} />
          <SafeAreaProvider>
            <ToastProvider>
              <UserContextProvider>
                <AppNavigation />
              </UserContextProvider>
            </ToastProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </EventProvider>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
