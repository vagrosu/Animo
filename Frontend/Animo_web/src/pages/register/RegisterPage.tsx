import React, {useEffect, useState} from "react";
import {ButtonBase} from "@mui/material";
import {useMutation} from "react-query";
import {AuthenticationRegisterResponseType} from "../../types/api/responses.ts";
import {AxiosError, isAxiosError} from "axios";
import {AuthentificationRegisterQueryType} from "../../types/api/queries.ts";
import {api} from "../../services/api.tsx";
import {toast} from "react-toastify";
import {useLoginMutation} from "../../utils/hooks.ts";
import CredentialsInput from "../../components/CredentialsInput.tsx";
import background1 from "../../assets/background1.webp";
import background2 from "../../assets/background2.webp";
import background3 from "../../assets/background3.webp";
import {Link, useNavigate} from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [background, setBackground] = useState(background1);
  const imageList = [background1, background2, background3];

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
      if (isAxiosError(error) && typeof error.response?.data === "string") {
        toast.error(error.response.data);
      }
      toast.error(error.message)
    }
  })
  const isRegisterButtonEnabled = !!(!mutation.isLoading && username && firstName && lastName && email && phoneNumber && password && confirmPassword);


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

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

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
    <div
      className={"h-full w-full flex items-center justify-center transition-[background] duration-700 ease-in-out"}
      style={{backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center"}}
    >
      <form
        onSubmit={onRegister}
        className={"flex flex-col w-[40rem] p-7 bg-white rounded-3xl"}
      >
        <i
          className={"fa-solid fa-xmark text-2xl ml-auto cursor-pointer"}
          onClick={() => navigate("/")}
        />
        <h1 className={"text-3xl mt-7"}>Sign up</h1>
        <p className={"text-gray-500 mt-7"}>Username</p>
        <CredentialsInput
          autoFocus
          className={"mt-1"}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className={"flex gap-4"}>
          <div className={"w-full"}>
            <p className={"text-gray-500 mt-5"}>First name</p>
            <CredentialsInput
              className={"mt-1 w-full"}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={"w-full"}>
            <p className={"text-gray-500 mt-5"}>Last name</p>
            <CredentialsInput
              className={"mt-1 w-full"}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <p className={"text-gray-500 mt-5"}>Email</p>
        <CredentialsInput
          className={"mt-1"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className={"text-gray-500 mt-5"}>Phone number</p>
        <CredentialsInput
          className={"mt-1"}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className={"flex justify-between text-gray-500 mt-5"}>
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
          className={"mt-1"}
          onChange={(e) => setPassword(e.target.value)}
          type={!showPassword ? "password" : "text"}
        />
        <p className={"text-gray-500 mt-5"}>Confirm password</p>
        <CredentialsInput
          className={"mt-1"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={!showPassword ? "password" : "text"}
        />
        <ButtonBase
          type={"submit"}
          disabled={!isRegisterButtonEnabled}
          className={`!mt-6 !p-3 ${isRegisterButtonEnabled ? "!bg-blue-600 cursor-pointer" : "!bg-gray-300"} !text-gray-50 !text-lg !rounded-3xl !transition-all !ease-in-out`}
        >
          Create Account
        </ButtonBase>
        <div className={"flex gap-1 my-8 px-1"}>
          <p
            className={"text-gray-500"}
          >Already have an account?</p>
          <Link
            to={"/auth/login"}
            className={"text-blue-600"}
          >Sign in</Link>
        </div>
      </form>
    </div>
  )
}