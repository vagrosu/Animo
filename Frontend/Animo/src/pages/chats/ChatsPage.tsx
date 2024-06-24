import ChatRoomsList from "./ChatRoomsList.tsx";
import {useEffect, useState} from "react";
import ConversationContainer from "./conversation/ConversationContainer.tsx";
import Sidebar from "./Sidebar.tsx";
import ConversationPlaceholder from "./conversation/ConversationPlaceholder.tsx";
import NewChatModal from "./newChatModal/NewChatModal.tsx";
import {useParams} from "react-router-dom";
import ChatRoomHubContextProvider from "../../context/ChatRoomHubContext.tsx";
import ChatRoomsListHubContextProvider from "../../context/ChatRoomsListHubContext.tsx";
import useWindowDimensions from "../../utils/hooks.ts";

export default function ChatsPage() {
  const params = useParams();
  const screenWidth = useWindowDimensions().width;
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [isChatRoomListOpen, setIsChatRoomListOpen] = useState(true);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  useEffect(() => {
    setSelectedChatRoomId(params.chatId || null);
  }, [params.chatId]);

  useEffect(() => {
    if (screenWidth < 1024) {
      setIsChatRoomListOpen(false);
    } else {
      setIsChatRoomListOpen(true);
    }
  }, [screenWidth]);

  return (
    <ChatRoomsListHubContextProvider>
      <ChatRoomHubContextProvider>
        <div className={"flex h-screen max-h-screen"}>
          <Sidebar
            openCreateChatRoomModal={() => setIsCreateChatModalOpen(true)}
          />
          <ChatRoomsList
            isChatRoomListOpen={isChatRoomListOpen}
            setIsChatRoomListOpen={setIsChatRoomListOpen}
            selectedChatRoomId={selectedChatRoomId}
            setSelectedChatRoomId={setSelectedChatRoomId}
          />
          <div className={"w-full h-full flex border-l border-gray-200"}>
            {selectedChatRoomId ? (
              <ConversationContainer selectedChatRoomId={selectedChatRoomId}/>
            ) : (
              <ConversationPlaceholder/>
            )}
          </div>
          {isCreateChatModalOpen && <NewChatModal
            isOpen={isCreateChatModalOpen}
            onClose={() => setIsCreateChatModalOpen(false)}
          />}
        </div>
      </ChatRoomHubContextProvider>
    </ChatRoomsListHubContextProvider>
  )
}