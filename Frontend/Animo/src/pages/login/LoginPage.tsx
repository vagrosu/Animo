import {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {LoadingButton} from '@mui/lab';
import {useLoginMutation} from "../../utils/hooks.ts";

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const onLogin = () => {
    loginMutation.mutate({ identifier, password });
  }

  return (
    <div>
      <h1>Login</h1>
      <TextField
        onChange={(e) => setIdentifier(e.target.value)}
        variant={"outlined"}
        label={"Username or Email"}
      />
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        variant={"outlined"}
        label={"Password"}
        type={"password"}
      />
      <LoadingButton
        onClick={onLogin}
        variant="outlined"
        loading={loginMutation.isLoading}
      >
        Login
      </LoadingButton>
    </div>
  )
}