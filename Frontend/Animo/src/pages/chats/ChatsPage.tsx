import ChatRoomsList from "./ChatRoomsList.tsx";
import {useEffect, useState} from "react";
import ConversationContainer from "./conversation/ConversationContainer.tsx";
import Sidebar from "./Sidebar.tsx";
import ConversationPlaceholder from "./conversation/ConversationPlaceholder.tsx";
import NewChatModal from "./newChatModal/NewChatModal.tsx";
import {useParams} from "react-router-dom";
import ChatRoomHubContextProvider from "../../context/ChatRoomHubContext.tsx";
import ChatRoomsListHubContextProvider from "../../context/ChatRoomsListHubContext.tsx";

export default function ChatsPage() {
  const params = useParams();
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  useEffect(() => {
    setSelectedChatRoomId(params.chatId || null);
  }, [params.chatId]);

  return (
    <ChatRoomsListHubContextProvider>
      <ChatRoomHubContextProvider>
        <div className={"flex h-screen max-h-screen"}>
          <Sidebar
            openCreateChatRoomModal={() => setIsCreateChatModalOpen(true)}
          />
          <ChatRoomsList
            selectedChatRoomId={selectedChatRoomId}
            setSelectedChatRoomId={setSelectedChatRoomId}
          />
          {selectedChatRoomId ? (
            <ConversationContainer selectedChatRoomId={selectedChatRoomId}/>
          ) : (
            <ConversationPlaceholder/>
          )}
          {isCreateChatModalOpen && <NewChatModal
            isOpen={isCreateChatModalOpen}
            onClose={() => setIsCreateChatModalOpen(false)}
          />}
        </div>
      </ChatRoomHubContextProvider>
    </ChatRoomsListHubContextProvider>
  )
}