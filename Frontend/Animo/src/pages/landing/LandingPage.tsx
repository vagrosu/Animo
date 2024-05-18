import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function LandingPage() {
  const navigation = useNavigate();
  return (
    <div>
      <h1>Landing</h1>
      <Button
        onClick={() => navigation("/auth/login")}
      >
        To Login
      </Button>
      <Button
        onClick={() => navigation("/auth/register")}
      >
        Create account
      </Button>
    </div>
  )
}