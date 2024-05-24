import {useQuery} from "react-query";
import { api } from "../services/api.tsx";
import {Navigate} from "react-router-dom";
import {AuthenticationCurrentUserResponseType} from "../types/api/responses.tsx";
import {createContext, ReactNode, useContext} from "react";
import {AxiosError, isAxiosError} from "axios";

type UserContextType = {
  isAuthenticated: boolean,
  userId: string | null,
}

type UserType = {
  isAuthenticated: boolean,
  userId: string,
}

const UserContext = createContext<UserContextType>({
  isAuthenticated: false,
  userId: null,
})

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }

  if (!context.userId) {
    window.location.href = "/auth/login";
  }

  return context as UserType;
}

export default function UserContextProvider({children}: {children: ReactNode}) {
  const {data, isLoading, error} = useQuery<AuthenticationCurrentUserResponseType, Error | AxiosError>({
    queryKey: ["Authentication", "current-user", "LoginRequiredContext"],
    queryFn: async () => api.get<AuthenticationCurrentUserResponseType>("Authentication/current-user")
      .then((res) => res.data)
  })

  if (isLoading) {
    return <div>Loading</div>
  }

  if (error) {
    if ((isAxiosError(error) && error.response?.status !== 401) || !isAxiosError(error)) {
      return (
        <>
          {children}
          <Navigate to={"/auth/login"} replace/>
        </>
      )
    }
  }

  const user: UserContextType = {
    isAuthenticated: data?.user.isAuthenticated || false,
    userId: data?.user.userId || null,
  }

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}