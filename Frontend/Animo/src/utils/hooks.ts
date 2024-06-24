import {useMutation} from "react-query";
import {AuthenticationLoginResponseType} from "../types/api/responses.ts";
import {AxiosError} from "axios";
import {AuthenticationLoginQueryType} from "../types/api/queries.ts";
import {toast} from "react-toastify";
import {api} from "../services/api.tsx";
import {getErrorMessage} from "./helpers.ts";
import {useEffect, useState} from "react";

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
      toast.error(getErrorMessage(error));
    },
  });
}



export default function useWindowDimensions() {
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}