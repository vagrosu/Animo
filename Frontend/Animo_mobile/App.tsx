import { LogBox, Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import AppNavigation from "./navigation/AppNavigation";
import { QueryClient, QueryClientProvider } from "react-query";
import UserContextProvider from "./context/UserContext";
import ToastProvider from "./context/ToastProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { EventProvider } from "react-native-outside-press";

LogBox.ignoreLogs(["AxiosError: Request failed with status code 401"]);

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
    <EventProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle={"default"} />
        <SafeAreaView style={styles.safeAreaView}>
          <SafeAreaProvider>
            <ToastProvider>
              <UserContextProvider>
                <AppNavigation />
              </UserContextProvider>
            </ToastProvider>
          </SafeAreaProvider>
        </SafeAreaView>
      </QueryClientProvider>
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
