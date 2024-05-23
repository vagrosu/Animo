import ChatRoomsList from "./ChatRoomsList.tsx";
import {useState} from "react";
import ConversationContainer from "./conversation/ConversationContainer.tsx";
import {SelectedChatRoomType} from "./types.ts";
import Sidebar from "./Sidebar.tsx";
import ConversationPlaceholder from "./conversation/ConversationPlaceholder.tsx";
import NewChatModal from "./newChatModal/NewChatModal.tsx";
import {useParams} from "react-router-dom";

export default function ChatsPage() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<SelectedChatRoomType | null>(
    {chatRoomId: useParams().chatId} || null
  );
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);

  return (
    <div className={"flex h-screen max-h-screen"}>
      <Sidebar
        openCreateChatRoomModal={() => setIsCreateChatModalOpen(true)}
      />
      <ChatRoomsList
        selectedChatRoom={selectedChatRoom}
        setSelectedChatRoom={setSelectedChatRoom}
      />
      {selectedChatRoom?.chatRoomId ? (
        <ConversationContainer selectedChatRoom={selectedChatRoom}/>
      ) : (
        <ConversationPlaceholder/>
      )}
      {isCreateChatModalOpen && <NewChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
      />}
    </div>
  )
}