import ChatRoomsList from "./ChatRoomsList.tsx";
import {useState} from "react";
import ConversationContainer from "./conversation/ConversationContainer.tsx";
import {ChatRoomType} from "./types.ts";
import Sidebar from "./Sidebar.tsx";
import ConversationPlaceholder from "./conversation/ConversationPlaceholder.tsx";

export default function ChatsPage() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoomType | null>(null);

  return (
    <div className={"flex h-full"}>
      <Sidebar />
      <ChatRoomsList
        selectedChatRoom={selectedChatRoom}
        setSelectedChatRoom={setSelectedChatRoom}
      />
      {selectedChatRoom ? (
        <ConversationContainer chatRoom={selectedChatRoom}/>
      ) : (
        <ConversationPlaceholder />
      )}
    </div>
  )
}