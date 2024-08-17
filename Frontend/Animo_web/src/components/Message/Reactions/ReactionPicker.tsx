import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import {useClickOutside} from "../../../utils/helpers.ts";
import {useRef, useState} from "react";
import {useMutation} from "react-query";
import {
  CreateOrUpdateMessageReactionResponseType,
  DeleteMessageReactionResponseType
} from "../../../types/api/responses.ts";
import {AxiosError} from "axios";
import {CreateOrUpdateMessageReactionsQueryType, DeleteMessageReactionsQueryType} from "../../../types/api/queries.ts";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {ReactionType} from "../../../pages/chats/types.ts";
import styles from "./ReactionPicker.module.scss";

type ReactionPickerProps = {
  messageId: string,
  selectedReaction: ReactionType | undefined,
  isIconDisplayed: boolean,
  setIsIconDisplayed?: (isIconDisplayed: boolean) => void,
}

export default function ReactionPicker({messageId, selectedReaction, isIconDisplayed, setIsIconDisplayed}: ReactionPickerProps) {
  const user = useUser();
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const modifyMessageReactionMutation = useMutation<
    CreateOrUpdateMessageReactionResponseType,
    Error | AxiosError,
    CreateOrUpdateMessageReactionsQueryType
  >({
    mutationFn: async (data) => api.put(`Messages/reactions`, {
      messageId: data.messageId,
      senderId: data.senderId,
      emoji: data.emoji
    })
  })

  const deleteMessageReactionMutation = useMutation<
    DeleteMessageReactionResponseType,
    Error | AxiosError,
    DeleteMessageReactionsQueryType
  >({
    mutationFn: async (data) => api.delete(`Messages/reactions/${data.messageReactionId}`)
  })

  useClickOutside(emojiPickerRef, (e) => {
    e.stopPropagation();
    setIsEmojiPickerOpen(false);
  })

  const onReactionClick = (emoji: EmojiClickData) => {
    setIsEmojiPickerOpen(false);
    setIsIconDisplayed && setIsIconDisplayed(false);

    if (selectedReaction && emoji.unified === selectedReaction.emoji) {
      deleteMessageReactionMutation.mutate({
        messageReactionId: selectedReaction.messageReactionId
      })
    } else {
      modifyMessageReactionMutation.mutate({
        messageId: messageId,
        senderId: user.userId,
        emoji: emoji.unified
      })
    }
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
            className={`!bg-gray-50 ${selectedReaction ? styles[selectedReaction.emoji] : ""}`}
            reactionsDefaultOpen={true}
            allowExpandReactions={false}
            skinTonesDisabled={true}
          />
        </div>
      )}
    </div>
  )
}