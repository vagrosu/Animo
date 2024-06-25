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

export const EXPANDED_CHAT_ROOM_LIST_MIN_WIDTH = 1024;

export default function ChatsPage() {
  const params = useParams();
  const screenWidth = useWindowDimensions().width;
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [isChatRoomListExpanded, setIsChatRoomListExpanded] = useState(true);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  useEffect(() => {
    setSelectedChatRoomId(params.chatId || null);
  }, [params.chatId]);

  useEffect(() => {
      setIsChatRoomListExpanded(screenWidth >= EXPANDED_CHAT_ROOM_LIST_MIN_WIDTH);
  }, [screenWidth]);

  return (
    <ChatRoomsListHubContextProvider>
      <ChatRoomHubContextProvider>
        <div className={"flex h-screen max-h-screen"}>
          <Sidebar
            openCreateChatRoomModal={() => setIsCreateChatModalOpen(true)}
          />
          <div className={"w-full h-full flex relative"}>
            <ChatRoomsList
              isChatRoomListExpanded={isChatRoomListExpanded}
              setIsChatRoomListExpanded={setIsChatRoomListExpanded}
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
        </div>
      </ChatRoomHubContextProvider>
    </ChatRoomsListHubContextProvider>
  )
}