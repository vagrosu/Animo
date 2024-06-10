import {Avatar} from "@mui/material";
import {MessageCard} from "../MessageCard.tsx";
import {MemberType, MessageType} from "../../../pages/chats/types.ts";

type MessageDisplayProps = {
  message: MessageType,
  sender: MemberType | undefined,
}

export function MessageDisplay({message, sender}: MessageDisplayProps) {
  return (
    <div
      className={"flex"}>
      <Avatar
        alt={"User"}
        sx={{width: 28, height: 28}}
        className={"mt-5"}
      >
        <i className={"fa-solid fa-user text-sm"}/>
      </Avatar>
      <div className={"w-full [&>*]:max-w-full"}>
        <MessageCard
          message={message}
          senderFirstName={sender?.firstName || "Unknown"}
          isSentByUser={false}
          isLastFromGroup={true}
          isFirstFromGroup={true}
        />
      </div>
    </div>
  )
}