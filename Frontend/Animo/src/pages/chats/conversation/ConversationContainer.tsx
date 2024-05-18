import {ChatRoomType} from "../types.ts";
import Conversation from "./Conversation.tsx";
import MessageInput from "./MessageInput.tsx";

type ConversationContainerProps = {
  chatRoom: ChatRoomType,
}

export default function ConversationContainer ({chatRoom}: ConversationContainerProps) {
  return (
    <div>
      <h1>Conversation {chatRoom.name}</h1>
      <p>Chat room id: {chatRoom.chatRoomId}</p>
      <Conversation chatRoom={chatRoom} />
      <MessageInput chatRoom={chatRoom} />
    </div>
  )
}