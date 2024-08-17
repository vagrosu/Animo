import {UserType} from "./types.ts";
import {Avatar} from "@mui/material";

type NewChatModalUsersListItemProps = {
  user: UserType,
  onSelect: () => void,
  isSelected: boolean,
}

export default function NewChatModalUsersListItem({user, onSelect, isSelected}: NewChatModalUsersListItemProps) {
  return (
    <div
      onClick={onSelect}
      className={"flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer"}
    >
      <i className={`fa-${isSelected ? "solid" : "regular"} fa-circle text-sm text-blue-600`} />
      <Avatar
        alt={"User"}
        className={"ml-3.5"}
        sx={{width: 30, height: 30}}
      >
        <i className={"fa-solid fa-user text-sm text-zinc-50"} />
      </Avatar>
      <p className={"ml-1.5"}>{user.firstName} {user.lastName}</p>
    </div>
  )
}