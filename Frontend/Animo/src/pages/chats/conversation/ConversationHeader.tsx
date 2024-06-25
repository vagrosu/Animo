import {ChatRoomType} from "../types";
import {Avatar} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type ConversationHeaderProps = {
  chatRoom: ChatRoomType,
  toggleMembersList: () => void,
}

export default function ConversationHeader({chatRoom, toggleMembersList}: ConversationHeaderProps) {
  return (
    <div className={"w-full px-5 py-3 flex items-center border-b border-gray-200"}>
        <Avatar
          alt={"User"}
          sx={{width: 42, height: 42}}
        >
          <i className={`fa-solid fa-${chatRoom.isGroupChat ? "users" : "user"}`}/>
        </Avatar>
        <p className={"text-xl ml-3"}>
          {chatRoom.name}
        </p>
      <InfoOutlinedIcon
        className={"ml-auto cursor-pointer text-blue-600"}
        onClick={toggleMembersList}
      />
    </div>
  )
}