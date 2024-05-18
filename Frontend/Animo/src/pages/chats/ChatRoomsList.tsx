import {useUser} from "../../context/UserContext.tsx";
import {useQuery} from "react-query";
import {api, chatRoomHubConnection} from "../../services/api.tsx";
import {ChatRoomsUserIdResponseType} from "../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {ChatRoomType} from "./types.ts";
import {Button} from "@mui/material";

type ChatRoomsListProps = {
  selectedChatRoom: ChatRoomType | null,
  setSelectedChatRoom: (val: ChatRoomType) => void,
}

export default function ChatRoomsList({selectedChatRoom, setSelectedChatRoom}: ChatRoomsListProps) {
  const user = useUser();

  const {data, isLoading, error} = useQuery<ChatRoomsUserIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", user.userId, "ChatRoomsList"],
    queryFn: async () => api.get<ChatRoomsUserIdResponseType>(`ChatRooms/${user.userId}`)
      .then((res) => res.data)
  })

  if (isLoading) {
    return <div>Loading</div>
  }

  if (error) {
    return <div>Error</div>
  }

  if (!data || data.chatRooms.length === 0) {
    return <div>No data</div>
  }

  const onSelectChatRoom = async (chatRoom: Omit<ChatRoomType, "connection">) => {
    if (selectedChatRoom && selectedChatRoom.chatRoomId === chatRoom.chatRoomId) {
      return;
    }

    try {
      if (selectedChatRoom?.connection) {
        await selectedChatRoom.connection.stop();
      }

      const conn = chatRoomHubConnection;
      await conn.start();
      await conn.invoke("JoinChatRoom", chatRoom.chatRoomId)

      setSelectedChatRoom({
        chatRoomId: chatRoom.chatRoomId,
        connection: conn,
        name: chatRoom.name,
        lastUsedTime: chatRoom.lastUsedTime,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {data.chatRooms.map((chatRoom) => (
        <Button
          key={chatRoom.chatRoomId}
          variant={"outlined"}
          onClick={() => onSelectChatRoom(chatRoom)}
        >
          {chatRoom.name}
        </Button>
      ))}
    </div>
  )
}