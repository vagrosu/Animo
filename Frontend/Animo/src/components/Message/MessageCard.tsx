import {Tooltip} from "@mui/material";
import {format, parseISO} from "date-fns";
import {MessageType} from "../../pages/chats/types.ts";
import {MessageContent} from "./MessageContent.tsx";

const getEmotionEmoji = (emotion: string) => {
  switch (emotion.toLowerCase()) {
    case "neutral":
      return "😐";
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
      return "⚠️"
  }
}

type MessageCardProps = {
  message: MessageType,
  senderFirstName: string,
  toggleEmotionDataModal?: () => void,
  isSentByUser: boolean,
  isFirstFromGroup: boolean,
  isLastFromGroup: boolean,
}

export function MessageCard({
                              message,
                              senderFirstName,
                              toggleEmotionDataModal,
                              isSentByUser,
                              isFirstFromGroup,
                              // isLastFromGroup
                            }: MessageCardProps) {

  return (
    <div className={"max-w-[60%]"}>
      {!isSentByUser && isFirstFromGroup && (
        <p className={"text-xs font-thin ml-2"}>{senderFirstName}</p>
      )}
      <div
        className={`flex flex-col gap-2 bg-zinc-100 px-4 py-3 ${isSentByUser ? `rounded-l-2xl ${!isFirstFromGroup && "rounded-r-2xl"}` : `rounded-r-2xl ml-2`} ${!isFirstFromGroup && "rounded-l-2xl"} rounded-b-2xl`}
      >
        <MessageContent message={message}/>
        <div
          className={`flex justify-end ${isSentByUser ? "pl-5" : "pr-5 flex-row-reverse"} text-nowrap text-gray-600 text-sm font-thin`}>
          <Tooltip
            title={message.emotion}
            placement={isSentByUser ? "left" : "right"}
            arrow={true}
          >
            <p
              onClick={toggleEmotionDataModal}
              className={`${toggleEmotionDataModal ? "cursor-pointer" : "cursor-default"} select-none text-sm ${isSentByUser ? "mr-1" : "ml-1"}`}
            >{getEmotionEmoji(message.emotion)}</p>
          </Tooltip>
          <p>{format(parseISO(message.sentTime), "HH:mm")}</p>
        </div>
      </div>
    </div>
  )
}