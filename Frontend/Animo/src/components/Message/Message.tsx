import {MemberType, MessageType} from "../../pages/chats/types.ts";
import {useUser} from "../../context/UserContext.tsx";
import {Avatar} from "@mui/material";
import {MessageCard} from "./MessageCard.tsx";

type MessageProps = {
  message: MessageType,
  sender: MemberType | undefined,
  isFirstFromGroup: boolean,
  isLastFromGroup: boolean
}

export default function Message({message, sender, isFirstFromGroup, isLastFromGroup}: MessageProps) {
  const {userId} = useUser();
  const isSentByUser = message.senderId === userId;

  return (
    <div className={`flex ${isSentByUser ? "justify-end" : ""} ${!isFirstFromGroup ? "ml-7" : ""} ${isLastFromGroup ? "mb-5" : "mb-1"}`}>
      {isFirstFromGroup && !isSentByUser && (
        <Avatar
          alt={"User"}
          sx={{width: 28, height: 28}}
          className={"mt-5"}
        >
          <i className={"fa-solid fa-user text-sm"}/>
        </Avatar>
      )}
      <MessageCard
        message={message}
        senderFirstName={sender?.firstName || "Unknown"}
        isSentByUser={isSentByUser}
        isFirstFromGroup={isFirstFromGroup}
        isLastFromGroup={isLastFromGroup}
      />
    </div>
  )
}