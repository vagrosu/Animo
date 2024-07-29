import { LogBox, SafeAreaView, StyleSheet } from "react-native";
import AppNavigation from "./navigation/AppNavigation";
import { QueryClient, QueryClientProvider } from "react-query";
import { StatusBar } from "expo-status-bar";
import UserContextProvider from "./context/UserContext";
import Toast from "react-native-toast-message";

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
    <>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <SafeAreaView style={{ flex: 1 }}>
          <UserContextProvider>
            <AppNavigation />
          </UserContextProvider>
        </SafeAreaView>
      </QueryClientProvider>
      <Toast position="bottom" />
    </>
  );
}
