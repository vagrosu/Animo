import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import {useClickOutside} from "../../../utils/helpers.ts";
import {useRef, useState} from "react";

type ReactionPickerProps = {
  messageId: string,
  isIconDisplayed: boolean,
  setIsIconDisplayed?: (isIconDisplayed: boolean) => void,
}

export default function ReactionPicker({messageId, isIconDisplayed, setIsIconDisplayed}: ReactionPickerProps) {
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useClickOutside(emojiPickerRef, (e) => {
    e.stopPropagation();
    setIsEmojiPickerOpen(false);
  })

  const onReactionClick = (emoji: EmojiClickData) => {
    setIsEmojiPickerOpen(false);
    setIsIconDisplayed && setIsIconDisplayed(false);
  }

  return (
    <div className={"relative w-[28px] h-[28px] my-auto mx-1.5"}>
      <i
        className={`fa-regular fa-face-smile ${isIconDisplayed || isEmojiPickerOpen ? "!visible" : "!hidden"} text-gray-400 p-1.5 rounded-full hover:bg-gray-200 ${isEmojiPickerOpen ? "bg-gray-200" : ""} select-none cursor-pointer`}
        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
      />
      {isEmojiPickerOpen && (
        <div
          ref={emojiPickerRef}
          className={"absolute z-10 bottom-8 left-[50%] -translate-x-1/2"}
        >
          <EmojiPicker
            open={isEmojiPickerOpen}
            onReactionClick={onReactionClick}
            style={{backgroundColor: "white"}}
            reactionsDefaultOpen={true}
            allowExpandReactions={false}
            lazyLoadEmojis={true}
            skinTonesDisabled={true}
          />
        </div>
      )}
    </div>
  )
}