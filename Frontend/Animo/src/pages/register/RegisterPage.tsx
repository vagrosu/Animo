import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useMutation} from "react-query";
import {AuthenticationRegisterResponseType} from "../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {AuthentificationRegisterQueryType} from "../../types/api/queries.tsx";
import {api} from "../../services/api.tsx";
import {toast} from "react-toastify";
import {useLoginMutation} from "../../utils/hooks.ts";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginMutation = useLoginMutation();
  const mutation = useMutation<AuthenticationRegisterResponseType, Error | AxiosError, AuthentificationRegisterQueryType>({
    mutationFn: async (query) => api.post<AuthenticationRegisterResponseType>(
      "Authentication/register",
      {
        username: query.username,
        firstName: query.firstName,
        lastName: query.lastName,
        email: query.email,
        phoneNumber: query.phoneNumber,
        password: query.password
      }
    ).then((res) => res.data),
    onSuccess: () => {
      loginMutation.mutate({
        identifier: email,
        password: password
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const onRegister = () => {
    mutation.mutate({
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      password
    });
  }

  return (
    <div>
      <h1>Register</h1>
      <TextField
        onChange={(e) => setUsername(e.target.value)}
        variant={"outlined"}
        label={"Username"}
      />
      <TextField
        onChange={(e) => setFirstName(e.target.value)}
        variant={"outlined"}
        label={"First Name"}
      />
      <TextField
        onChange={(e) => setLastName(e.target.value)}
        variant={"outlined"}
        label={"Last Name"}
      />
      <TextField
        onChange={(e) => setEmail(e.target.value)}
        variant={"outlined"}
        label={"Email"}
      />
      <TextField
        onChange={(e) => setPhoneNumber(e.target.value)}
        variant={"outlined"}
        type={"tel"}
        label={"Phone Number"}
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        variant={"outlined"}
        label={"Password"}
        type={"password"}
      />
      <TextField
        onChange={(e) => setConfirmPassword(e.target.value)}
        variant={"outlined"}
        label={"Confirm Password"}
        type={"password"}
      />
      <LoadingButton
        onClick={onRegister}
        variant="outlined"
        loading={mutation.isLoading}
      >
        Create Account
      </LoadingButton>
    </div>
  )
}