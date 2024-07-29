import { useMutation } from "react-query";
import { AuthenticationLoginResponseType } from "../types/api/responses.ts";
import { AxiosError } from "axios";
import { AuthenticationLoginQueryType } from "../types/api/queries.ts";
import { createApiInstance } from "../services/api.tsx";
import { getErrorMessage } from "./helpers.ts";
import Toast from "react-native-toast-message";
import { useUser } from "../context/UserContext.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

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