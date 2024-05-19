import {ChatRoomType} from "../types.ts";
import Conversation from "./Conversation.tsx";
import MessageInput from "./MessageInput.tsx";
import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {UsersChatRoomIdResponseType} from "../../../types/api/responses.tsx";
import {AxiosError} from "axios";

type ConversationContainerProps = {
  chatRoom: ChatRoomType,
}

export default function ConversationContainer ({chatRoom}: ConversationContainerProps) {
  const membersQuery = useQuery<UsersChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Users", chatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<UsersChatRoomIdResponseType>(`Users?chatRoomId=${chatRoom.chatRoomId}`)
      .then((res) => res.data)
  })

  if (membersQuery.isLoading) {
    return <div>Loading</div>
  }

  if (membersQuery.error) {
    return <div>Error</div>
  }

  if (!membersQuery.data || membersQuery.data.members.length === 0) {
    return <div>No data</div>
  }

  return (
    <div>
      <h1>Conversation {chatRoom.name}</h1>
      <p>Chat room id: {chatRoom.chatRoomId}</p>
      <Conversation
        chatRoom={chatRoom}
        members={membersQuery.data.members}
      />
      <MessageInput chatRoom={chatRoom} />
    </div>
  )
}