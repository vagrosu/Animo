import {Tooltip} from "@mui/material";
import {format, parseISO} from "date-fns";
import {MessageType} from "../../pages/chats/types.ts";
import {MessageContent} from "./MessageContent.tsx";
import {Emoji, EmojiStyle} from "emoji-picker-react";
import MessageReactions from "./Reactions/MessageReactions.tsx";

const getEmotionEmoji = (emotion: string) => {
  switch (emotion.toLowerCase()) {
    case "neutral":
      return "1f610";
    case "joy":
      return "1f604";
    case "sadness":
      return "1f622";
    case "anger":
      return "1f621";
    case "fear":
      return "1f628";
    case "surprise":
      return "1f62e";
    case "disgust":
      return "1f922";
    default:
    return "26a0-fe0f";
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
    <div className={"relative max-w-[60%]"}>
      {!isSentByUser && isFirstFromGroup && (
        <p className={"text-xs font-thin ml-2"}>{senderFirstName}</p>
      )}
      <div
        className={`flex flex-col gap-2 bg-zinc-100 px-4 py-3.5 ${isSentByUser ? `rounded-l-2xl ${!isFirstFromGroup && "rounded-r-2xl"}` : `rounded-r-2xl ml-2`} ${!isFirstFromGroup && "rounded-l-2xl"} rounded-b-2xl`}
      >
        <MessageContent message={message}/>
        <div
          className={`flex justify-end ${isSentByUser ? "pl-5" : "pr-5 flex-row-reverse"} text-nowrap text-gray-600 text-sm font-thin`}>
          <Tooltip
            title={message.emotion}
            placement={isSentByUser ? "left" : "right"}
            arrow={true}
          >
            <div
              onClick={toggleEmotionDataModal}
              className={`flex items-center content-center ${toggleEmotionDataModal ? "cursor-pointer" : "cursor-default"} select-none text-sm ${isSentByUser ? "mr-1" : "ml-1"}`}
            >
              <Emoji
                size={16.5}
                unified={getEmotionEmoji(message.emotion)}
                emojiStyle={EmojiStyle.APPLE}
              />
            </div>
          </Tooltip>
          <p>{format(parseISO(message.sentTime), "HH:mm")}</p>
        </div>
      </div>
      {!!message.reactions.length && <MessageReactions
        reactions={message.reactions}
        isSentByUser={isSentByUser}
      />}
    </div>
  )
}