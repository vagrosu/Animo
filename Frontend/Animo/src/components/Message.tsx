import {MemberType, MessageType} from "../pages/chats/types.ts";
import {format, parseISO} from "date-fns";
import {useUser} from "../context/UserContext.tsx";
import {Avatar, Tooltip} from "@mui/material";

const getEmotionEmoji = (emotion: string) => {
  switch (emotion.toLowerCase()) {
    case "joy":
      return "😁";
    case "sadness":
      return "😢";
    case "anger":
      return "😡";
    case "fear":
      return "😨";
    case "surprise":
      return "😲";
    case "disgust":
      return "🤢";
    default:
      return "😐";
  }
}

type MessageCardProps = {
  message: MessageType,
  isSentByUser: boolean,
  isFirstFromGroup: boolean,
  isLastFromGroup: boolean
}

function MessageCard({message, isSentByUser, isFirstFromGroup, isLastFromGroup}: MessageCardProps) {

  return (
    <div
      className={`max-w-[60%] flex flex-col gap-2 bg-zinc-100 px-4 py-3 ${isSentByUser ? `rounded-l-2xl ${!isFirstFromGroup && "rounded-r-2xl"}` : `rounded-r-2xl ml-2`} ${!isFirstFromGroup && "rounded-l-2xl"} rounded-b-2xl`}>
      <p>{message.text}</p>
      <div
        className={`flex justify-end ${isSentByUser ? "pl-5" : "pr-5 flex-row-reverse"} text-nowrap text-gray-600 text-sm font-thin`}>
        <Tooltip
          title={message.emotion}
          placement={isSentByUser ? "left" : "right"}
          arrow={true}
        >
          <p className={`cursor-default ${isSentByUser ? "mr-1" : "ml-1"}`}>{getEmotionEmoji(message.emotion)}</p>
        </Tooltip>
        <p>{format(parseISO(message.sentTime), "HH:mm")}</p>
      </div>
    </div>
  )
}

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
    <div className={`flex ${isSentByUser && "justify-end"} ${!isFirstFromGroup && "ml-6"} ${isLastFromGroup ? "mb-5" : "mb-1"}`}>
      {isFirstFromGroup && !isSentByUser && (
        <div>
          {/*<p className={"text-sm font-extralight"}>{sender?.firstName || "Unknown"}</p>*/}
          <Avatar
            alt={"User"}
            sx={{width: 28, height: 28}}
          >
            <i className={"fa-solid fa-user text-sm"}/>
          </Avatar>
        </div>
      )}
      <MessageCard
        message={message}
        isSentByUser={isSentByUser}
        isFirstFromGroup={isFirstFromGroup}
        isLastFromGroup={isLastFromGroup}
      />
    </div>
  )
}