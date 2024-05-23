import {ChatRoomType, SelectedChatRoomType} from "../types.ts";
import Conversation from "./Conversation.tsx";
import MessageInput from "./MessageInput.tsx";
import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {ChatRoomsByChatRoomIdResponseType, UsersByChatRoomIdResponseType} from "../../../types/api/responses.tsx";
import {AxiosError} from "axios";
import ConversationHeader from "./ConversationHeader.tsx";

type ConversationContainerProps = {
  selectedChatRoom: SelectedChatRoomType,
}

export default function ConversationContainer ({selectedChatRoom}: ConversationContainerProps) {
  const chatRoomQuery = useQuery<ChatRoomsByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", selectedChatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<ChatRoomsByChatRoomIdResponseType>(`ChatRooms/${selectedChatRoom.chatRoomId}`)
      .then((res) => res.data)
  })

  const membersQuery = useQuery<UsersByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Users", "by-chat-room-id", selectedChatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<UsersByChatRoomIdResponseType>(`Users/by-chat-room-id?chatRoomId=${selectedChatRoom.chatRoomId}`)
      .then((res) => res.data)
  })

  if (chatRoomQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (chatRoomQuery.isError || !chatRoomQuery.data) {
    return <div>Error</div>
  }

  const chatRoom: ChatRoomType = {
    chatRoomId: chatRoomQuery.data.chatRoom.chatRoomId,
    name: chatRoomQuery.data.chatRoom.name,
    lastUsedTime: chatRoomQuery.data.chatRoom.lastUsedTime,
  };

  return (
    <div className={"flex flex-col w-full h-full"}>
      <ConversationHeader chatRoom={chatRoom} />
      <Conversation
        selectedChatRoom={selectedChatRoom}
        chatRoom={chatRoom}
        membersQuery={membersQuery}
      />
      <MessageInput selectedChatRoom={selectedChatRoom} />
    </div>
  )
}