import {useUser} from "../../context/UserContext.tsx";
import {useQuery} from "react-query";
import {api, chatRoomHubConnection} from "../../services/api.tsx";
import {ChatRoomsByUserIdResponseType} from "../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {ChatRoomType, SelectedChatRoomType} from "./types.ts";
import {useState} from "react";
import SortByDropdown, {SORT_BY_OPTIONS} from "../../components/SortByDropdown.tsx";
import ChatRoomCard from "../../components/ChatRoomCard.tsx";
import SearchInput from "../../components/SearchInput.tsx";
import {useNavigate} from "react-router-dom";

const sortByFunction = (a: Omit<ChatRoomType, "connection">, b: Omit<ChatRoomType, "connection">, sortBy: number) => {
  switch (sortBy) {
    case SORT_BY_OPTIONS.NEWEST:
      return new Date(b.lastUsedTime).getTime() - new Date(a.lastUsedTime).getTime();
    case SORT_BY_OPTIONS.OLDEST:
      return new Date(a.lastUsedTime).getTime() - new Date(b.lastUsedTime).getTime();
    case SORT_BY_OPTIONS.NAME_A_Z:
      return a.name.localeCompare(b.name);
    case SORT_BY_OPTIONS.NAME_Z_A:
      return b.name.localeCompare(a.name);
    default:
      return 0;
  }
}

type ChatRoomsListProps = {
  selectedChatRoom: SelectedChatRoomType | null,
  setSelectedChatRoom: (val: SelectedChatRoomType) => void,
}

export default function ChatRoomsList({selectedChatRoom, setSelectedChatRoom}: ChatRoomsListProps) {
  const user = useUser();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState(SORT_BY_OPTIONS.NEWEST);

  const {data, isLoading, error} = useQuery<ChatRoomsByUserIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", "by-user-id", user.userId, "ChatRoomsList"],
    queryFn: async () => api.get<ChatRoomsByUserIdResponseType>(`ChatRooms/by-user-id?userId=${user.userId}`)
      .then((res) => res.data)
  })

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
      });
      navigate(`/chats/${chatRoom.chatRoomId}`)
    } catch (e) {
      console.log(e);
    }
  }

  const chatRooms = data?.chatRooms || [];

  return (
    <div className={"flex flex-col border-r border-gray-200 min-w-[17rem] w-[32vw] max-w-[23rem]"}>
      <div className={"pt-7 px-5"}>
        <h1 className={"font-bold text-3xl leading-8"}>
          Messages
        </h1>
        <SearchInput className={"mt-5"}/>
        <SortByDropdown
          sortBy={sortBy}
          setSortBy={setSortBy}
          className={"ml-2.5 mt-2"}
        />
      </div>
      <div className={"mt-2.5"}>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error</div>
        ) : chatRooms
          .sort((a, b) => sortByFunction(a, b, sortBy))
          .map((chatRoom) => (
            <ChatRoomCard
              key={chatRoom.chatRoomId}
              chatRoom={chatRoom}
              onSelectChatRoom={() => onSelectChatRoom(chatRoom)}
            />
          ))}
      </div>
    </div>
  )
}