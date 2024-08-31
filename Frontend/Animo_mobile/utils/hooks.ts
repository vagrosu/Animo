import { useMutation } from "react-query";
import { AuthenticationLoginResponseType } from "../types/api/responses.ts";
import { AxiosError } from "axios";
import { AuthenticationLoginQueryType } from "../types/api/queries.ts";
import { createApiInstance } from "../services/api.tsx";
import { getErrorMessage } from "./helpers.ts";
import Toast from "react-native-toast-message";
import { useUser } from "../context/UserContext.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useActionSheet } from "@expo/react-native-action-sheet";

export function useLoginMutation() {
  const user = useUser();

  return useMutation<AuthenticationLoginResponseType, AxiosError, AuthenticationLoginQueryType>({
    mutationFn: async (query) => {
      const api = await createApiInstance();
      return api
        .post<AuthenticationLoginResponseType>("Authentication/login", {
          identifier: query.identifier,
          password: query.password,
        })
        .then((res) => res.data);
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem("token", data);
      user.refetch();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: getErrorMessage(error),
      });
    },
  });
}

export function useSafeAreaStyle(style?: StyleProp<ViewStyle>) {
  const safeArea = useSafeAreaInsets();
  const oldStyle = StyleSheet.flatten(style || {});

  const safeAdd = (original: number, extra: any): number => {
    try {
      const newValue = original + extra;

      if (typeof newValue === "number") {
        return newValue;
      }
    } catch (e) {
      console.error(e);
      return original;
    }

    return original;
  };

  const newStyle = StyleSheet.flatten({
    ...oldStyle,
    paddingTop: safeAdd(safeArea.top, oldStyle?.paddingTop || oldStyle?.paddingVertical || oldStyle?.padding || 0),
    paddingBottom: safeAdd(safeArea.bottom, oldStyle?.paddingBottom || oldStyle?.paddingVertical || oldStyle?.padding || 0),
    paddingLeft: safeAdd(safeArea.left, oldStyle?.paddingLeft || oldStyle?.paddingHorizontal || oldStyle?.padding || 0),
    paddingRight: safeAdd(safeArea.right, oldStyle?.paddingRight || oldStyle?.paddingHorizontal || oldStyle?.padding || 0),
  });

  return newStyle;
}

export function useShowUserProfileWithActionSheet() {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const options = ["View Profile", "Cancel"];

  return (user: { userId: string; firstName: string; lastName: string }) =>
    showActionSheetWithOptions(
      {
        options,
        title: `${user.firstName} ${user.lastName}`,
        cancelButtonIndex: options.indexOf("Cancel"),
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex === options.indexOf("View Profile")) {
          navigation.navigate("UserProfile", { userId: user.userId });
        }
      }
    );
}
