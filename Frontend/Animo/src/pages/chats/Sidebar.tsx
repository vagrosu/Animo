import {Avatar, Tooltip} from "@mui/material";
import {useNavigate} from "react-router-dom";
import animoLogo from "../../assets/animo-logo.png";

export default function Sidebar() {
  const navigate = useNavigate();

  const onLogout = () => {
    navigate("/auth/login");
  }

  return (
    <div className={"flex flex-col items-center px-[0.625rem] py-7 w-[3.375rem] bg-zinc-50"}>
      <div className={"flex items-center content-center w-8 h-8"}>
        <img
          src={animoLogo}
          alt={"Animo Logo"}
          width={32}
          height={32}
          className={"cursor-pointer"}
        />

      </div>
      <Avatar
        alt={"User"}
        className={"mt-7 cursor-pointer"}
        sx={{ width: 32, height: 32 }}
      >
        <i className={"fa-solid fa-user"} />
      </Avatar>
      <div className={"mt-auto flex flex-col gap-7 text-2xl"}>
        <Tooltip
          title={"Settings"}
          placement={"right"}
          arrow
          disableInteractive
        >
          <i className={"fa-fw fa-solid fa-gear text-gray-500 hover:text-blue-600 cursor-pointer"} />
        </Tooltip>
        <Tooltip
          title={"Log out"}
          placement={"right"}
          arrow
          disableInteractive
        >
          <i
            onClick={onLogout}
            className={"fa-fw fa-solid fa-arrow-right-from-bracket fa-flip-horizontal text-gray-500 hover:text-blue-600 cursor-pointer"}
          />
        </Tooltip>
      </div>
    </div>
  )
}