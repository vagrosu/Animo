import {InputBase} from "@mui/material";
import {InputBaseProps} from "@mui/material/InputBase/InputBase";

type CredentialsInputProps = {
  className?: string,
} & InputBaseProps;

export default function CredentialsInput({className, ...rest}: CredentialsInputProps) {
  return (
    <InputBase
      {...rest}
      className={`px-3.5 p-2 border-gray-300 border-[1px] rounded-xl ${className || ""}`}
    />
  )
}