import { useEffect } from "react";
import { useChatRoomHub } from "../../../context/ChatRoomHubContext";
import Conversation from "./Conversation";
import ConversationHeader from "./ConversationHeader";
import MessageInput from "./MessageInput";
import { ChatRoomType } from "../types";

type ConversationContainerProps = {
  chatRoom: ChatRoomType;
};

export default function ConversationContainer({ chatRoom }: ConversationContainerProps) {
  const chatRoomHub = useChatRoomHub();

  useEffect(() => {
    if (chatRoom.chatRoomId && chatRoomHub.isConnected) {
      chatRoomHub.connection?.invoke("JoinChatRoom", chatRoom.chatRoomId);
    }

    return () => {
      if (chatRoom.chatRoomId && chatRoomHub.isConnected) {
        chatRoomHub.connection?.invoke("LeaveChatRoom", chatRoom.chatRoomId);
      }
    };
  }, [chatRoom.chatRoomId, chatRoomHub.isConnected]);

  return (
    <>
      <ConversationHeader chatRoom={chatRoom} />
      <Conversation chatRoom={chatRoom} />
      <MessageInput selectedChatRoomId={chatRoom.chatRoomId} />
    </>
  );
}
