import ChatRoomsList from "./ChatRoomsList.tsx";
import {useState} from "react";
import ConversationContainer from "./conversation/ConversationContainer.tsx";
import {ChatRoomType} from "./types.ts";

export default function ChatsPage() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoomType | null>(null);

  return (
    <div>
      <h1>ChatsPage</h1>
      <ChatRoomsList setSelectedChatRoom={setSelectedChatRoom}/>
      {selectedChatRoom && (
        <ConversationContainer chatRoom={selectedChatRoom}/>
      )}
    </div>
  )
}