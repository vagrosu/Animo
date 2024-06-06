import {useMutation} from "react-query";
import {AuthenticationLoginResponseType} from "../types/api/responses.ts";
import {AxiosError} from "axios";
import {AuthenticationLoginQueryType} from "../types/api/queries.ts";
import {toast} from "react-toastify";
import {api} from "../services/api.tsx";

export function useLoginMutation() {
  return useMutation<AuthenticationLoginResponseType, AxiosError, AuthenticationLoginQueryType>({
    mutationFn: async (query) =>
      api.post<AuthenticationLoginResponseType>("Authentication/login", {
        identifier: query.identifier,
        password: query.password,
      }).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data);
      window.location.href = "/chats";
    },
    onError: (error) => {
      if (typeof error.response?.data === "string") {
        toast.error(error.response?.data);
        return;
      }
      toast.error(error.message);
    },
  });
}