import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import animoLogo from "../../assets/animo-logo.png";

export default function LandingPage() {
  const navigation = useNavigate();
  return (
    <div className={"w-screen h-screen bg-landing-gradient"}>
      <div className={"flex items-center gap-4 w-full px-16 py-8"}>
        <div className={"flex items-center content-center w-10 h-10"}>
          <img
            src={animoLogo}
            alt={"Animo Logo"}
          />
        </div>
        <h1 className={"text-3xl font-bold tracking-wider text-blue-600"}>
          Animo
        </h1>
        <Button
          className={`w-24 !rounded-lg !ml-auto !py-1 !border-blue-600 !text-blue-600 !normal-case`}
          variant={"outlined"}
          onClick={() => navigation("/auth/login")}
        >
          Sign in
        </Button>
        <Button
          variant={"contained"}
          className={"w-24 !rounded-lg !py-1 !bg-blue-600 text-white !normal-case !shadow-none hover:!bg-blue-700"}
          onClick={() => navigation("/auth/register")}
        >
          Sign up
        </Button>
      </div>
      <div className={"absolute w-full flex flex-col items-center justify-center gap-8 top-[48%] translate-y-[-50%]"}>
        <div className={"flex items-center content-center w-52 h-52"}>
          <img
            src={animoLogo}
            alt={"Animo Logo"}
          />
        </div>
        <h1 className={"text-center tracking-wide text-gray-100 text-8xl font-bold"}>
          We make emotions<br/>
          clear and simple
        </h1>
      </div>
    </div>
  )
}