import { ReactionType } from "../../../pages/chats/types"
import {Emoji} from "emoji-picker-react";
import {Tooltip} from "@mui/material";


type MessageReactionsProps = {
  reactions: ReactionType[],
  isSentByUser: boolean
}

export default function MessageReactions({reactions, isSentByUser}: MessageReactionsProps) {
  const emojiSet = Array.from(new Set(reactions.map(reaction => reaction.emoji)));

  const tooltipContent = (
    <div className={"flex flex-col items-center gap-1 text-white"}>
      {emojiSet.map((emoji, i) => (
        <div key={i} className={"flex items-center gap-[1px]"}>
          <p className={"text-sm"}>{reactions.filter(r => r.emoji === emoji).length}</p>
          <Emoji
            unified={emoji}
            size={15}
          />
        </div>
      ))}
    </div>
  )

  return (
    <Tooltip
      title={tooltipContent}
      placement={isSentByUser ? "left" : "right"}
      arrow={true}
    >
      <div
        className={`absolute flex items-center gap-[1px] py-1 px-1.5 -my-1 -mx-1.5 bg-gray-300 hover:bg-gray-400 rounded-full z-10 -bottom-2.5 ${isSentByUser ? "-left-1" : "-right-1"} cursor-pointer`}
      >
        {emojiSet.slice(0, 3).map((emoji, i) => (
          <Emoji
            key={i}
            unified={emoji}
            size={15}
          />
        ))}
        <p
          className={`text-xs font-light text-gray-800 ml-0.5`}
        >
          {reactions.length}
        </p>
      </div>
    </Tooltip>
  )
}