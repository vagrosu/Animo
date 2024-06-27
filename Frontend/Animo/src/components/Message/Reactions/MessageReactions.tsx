import { ReactionType } from "../../../pages/chats/types"
import {Emoji} from "emoji-picker-react";


type MessageReactionsProps = {
  reactions: ReactionType[],
  isSentByUser: boolean
}

export default function MessageReactions({reactions, isSentByUser}: MessageReactionsProps) {
  const emojiList = Array.from(new Set(reactions.map(reaction => reaction.emoji)));

  return (
    <div
      className={`absolute flex items-center gap-[1px] py-1 px-1.5 -my-1 -mx-1.5 bg-gray-200 hover:bg-gray-300 rounded-full z-10 -bottom-2.5 ${isSentByUser ? "-left-0.5" : "-right-0.5"} cursor-pointer`}
    >
      {emojiList.slice(0, 3).map((emoji, i) => (
        <Emoji
          key={i}
          unified={emoji}
          size={15}
        />
      ))}
      <p
        className={`text-xs font-extralight ml-0.5`}
      >
        {reactions.length}
      </p>
    </div>
  )
}