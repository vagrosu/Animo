import {InputAdornment, InputBase} from "@mui/material";
import {InputBaseProps} from "@mui/material/InputBase/InputBase";

type SearchInputProps = {
  className?: string,
} & Omit<InputBaseProps, "className">;

export default function SearchInput ({className, ...rest}: SearchInputProps) {
  return (
    <InputBase
      className={`rounded-2xl border-0 bg-gray-200 px-3 py-1 w-full ${className || ""}`}
      placeholder={"Search"}
      startAdornment={
        <InputAdornment position="start">
          <i className={"fa-solid fa-magnifying-glass text-xs"}/>
        </InputAdornment>
      }
      {...rest}
    />
  )
}