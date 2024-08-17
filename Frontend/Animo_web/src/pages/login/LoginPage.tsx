import React, {useEffect, useState} from "react";
import {ButtonBase} from "@mui/material";
import {useLoginMutation} from "../../utils/hooks.ts";
import {Link, useNavigate} from "react-router-dom";
import background1 from "../../assets/background1.webp";
import background2 from "../../assets/background2.webp";
import background3 from "../../assets/background3.webp";
import CredentialsInput from "../../components/CredentialsInput.tsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [background, setBackground] = useState(background1);
  const imageList = [background1, background2, background3];
  const isLoginButtonEnabled = !loginMutation.isLoading && identifier && password;

  useEffect(() => {
    localStorage.removeItem("token");

    const imgs = imageList.map(image => {
      const img = new Image();
      img.src = image;
      return img;
    });

    return () => imgs.forEach(img => URL.revokeObjectURL(img.src));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackground(current => {
        const index = imageList.indexOf(current);
        return imageList[(index + 1) % imageList.length];
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ identifier, password });
  }

  return (
    <div
      className={"h-full w-full flex items-center justify-center transition-[background] duration-700 ease-in-out"}
      style={{backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center"}}
    >
      <form
        onSubmit={onLogin}
        className={"flex flex-col w-[35rem] p-7 bg-white rounded-3xl"}
      >
        <i
          className={"fa-solid fa-xmark text-2xl ml-auto cursor-pointer"}
          onClick={() => navigate("/")}
        />
        <h1 className={"text-3xl mt-7"}>Sign in</h1>
        <p className={"text-gray-500 mt-8"}>Username or email</p>
        <CredentialsInput
          autoFocus
          className={"mt-2"}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <div className={"flex justify-between text-gray-500 mt-8"}>
          <p>Password</p>
          <div
            className={"flex items-center cursor-pointer select-none gap-2 w-[4.5rem]"}
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`fa-fw fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}/>
            <p>{showPassword ? "Hide" : "Show"}</p>
          </div>
        </div>
        <CredentialsInput
          onChange={(e) => setPassword(e.target.value)}
          className={"mt-2"}
          type={!showPassword ? "password" : "text"}
        />
        <ButtonBase
          type={"submit"}
          disabled={!isLoginButtonEnabled}
          className={`!mt-8 !p-3 ${isLoginButtonEnabled ? "!bg-blue-600 cursor-pointer" : "!bg-gray-300"} !text-gray-50 !text-lg !rounded-3xl !transition-all !ease-in-out`}
        >
          Sign in
        </ButtonBase>
        <div className={"flex gap-1 my-10 px-1"}>
          <p
            className={"text-gray-500"}
          >Don't have an account?</p>
          <Link
            to={"/auth/register"}
            className={"text-blue-600"}
          >Sign up</Link>
        </div>
      </form>
    </div>
  )
}