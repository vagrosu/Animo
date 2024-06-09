import {MemberType, MessageType} from "../../pages/chats/types.ts";
import {useUser} from "../../context/UserContext.tsx";
import {Avatar} from "@mui/material";
import {MessageCard} from "./MessageCard.tsx";
import {useUserProfileModal} from "../../context/UserProfileModalContext/UserProfileModalContext.tsx";
import {toast} from "react-toastify";

type MessageProps = {
  message: MessageType,
  sender: MemberType | undefined,
  isFirstFromGroup: boolean,
  isLastFromGroup: boolean
}

export default function Message({message, sender, isFirstFromGroup, isLastFromGroup}: MessageProps) {
  const {userId} = useUser();
  const userProfileModal = useUserProfileModal();
  const isSentByUser = message.senderId === userId;

  const onProfileClick = () => {
    if (!sender?.userId) {
      toast.error("User not found");
      return;
    }

    userProfileModal.open(sender.userId);
  }

  return (
    <div className={`flex ${isSentByUser ? "justify-end" : ""} ${!isFirstFromGroup ? "ml-7" : ""} ${isLastFromGroup ? "mb-5" : "mb-1"}`}>
      {isFirstFromGroup && !isSentByUser && (
        <Avatar
          alt={"User"}
          sx={{width: 28, height: 28}}
          className={"mt-5 cursor-pointer"}
          onClick={onProfileClick}
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