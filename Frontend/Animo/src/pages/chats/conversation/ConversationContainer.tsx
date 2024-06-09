import {ChatRoomType} from "../types.ts";
import Conversation from "./Conversation.tsx";
import MessageInput from "./MessageInput.tsx";
import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {ChatRoomsByChatRoomIdResponseType} from "../../../types/api/responses.ts";
import {AxiosError} from "axios";
import ConversationHeader from "./ConversationHeader.tsx";

type ConversationContainerProps = {
  selectedChatRoomId: string,
}

export default function ConversationContainer ({selectedChatRoomId}: ConversationContainerProps) {
  const chatRoomQuery = useQuery<ChatRoomsByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", selectedChatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<ChatRoomsByChatRoomIdResponseType>(`ChatRooms/${selectedChatRoomId}`)
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
    members: chatRoomQuery.data.chatRoom.members,
    isGroupChat: chatRoomQuery.data.chatRoom.members.length > 2,
    lastUsedTime: chatRoomQuery.data.chatRoom.lastUsedTime,
  };

  return (
    <div className={"flex flex-col w-full h-full"}>
      <ConversationHeader chatRoom={chatRoom} />
      <Conversation chatRoom={chatRoom}/>
      <MessageInput selectedChatRoomId={selectedChatRoomId} />
    </div>
  )
}