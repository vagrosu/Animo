import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import {useClickOutside} from "../../../utils/helpers.ts";
import {useRef, useState} from "react";
import {useMutation} from "react-query";
import {CreateMessageReactionResponseType} from "../../../types/api/responses.ts";
import {AxiosError} from "axios";
import {CreateMessageReactionQueryType} from "../../../types/api/queries.ts";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {ReactionType} from "../../../pages/chats/types.ts";
import styles from "./ReactionPicker.module.scss";

type ReactionPickerProps = {
  messageId: string,
  selectedReactions: ReactionType[],
  isIconDisplayed: boolean,
  setIsIconDisplayed?: (isIconDisplayed: boolean) => void,
}

export default function ReactionPicker({messageId, selectedReactions, isIconDisplayed, setIsIconDisplayed}: ReactionPickerProps) {
  const user = useUser();
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const addMessageReactionMutation = useMutation<CreateMessageReactionResponseType, Error | AxiosError, CreateMessageReactionQueryType>({
    mutationFn: async (data) => api.post(`MessageReaction`, {
      messageId: data.messageId,
      senderId: data.senderId,
      emoji: data.emoji
    })
  })

  useClickOutside(emojiPickerRef, (e) => {
    e.stopPropagation();
    setIsEmojiPickerOpen(false);
  })

  const onReactionClick = (emoji: EmojiClickData) => {
    setIsEmojiPickerOpen(false);
    setIsIconDisplayed && setIsIconDisplayed(false);

    addMessageReactionMutation.mutate({
      messageId,
      senderId: user.userId,
      emoji: emoji.unified
    })
  }

  const selectedReactionsClassName = selectedReactions.map(reaction => styles[reaction.emoji]).join(" ");

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
            className={`!bg-gray-50 ${selectedReactionsClassName}`}
            reactionsDefaultOpen={true}
            allowExpandReactions={false}
            skinTonesDisabled={true}
          />
        </div>
      )}
    </div>
  )
}