import {useUser} from "../../context/UserContext.tsx";
import {useQuery} from "react-query";
import {api} from "../../services/api.tsx";
import {ChatRoomsByChatRoomIdResponseType, ChatRoomsByUserIdResponseType} from "../../types/api/responses.ts";
import {AxiosError} from "axios";
import {ChatRoomCardType} from "./types.ts";
import {useEffect, useState} from "react";
import SortByDropdown, {SORT_BY_OPTIONS} from "../../components/SortByDropdown.tsx";
import ChatRoomCard from "../../components/ChatRoomCard.tsx";
import SearchInput from "../../components/SearchInput.tsx";
import {useNavigate} from "react-router-dom";
import {useChatRoomHub} from "../../context/ChatRoomHubContext.tsx";
import {useChatRoomsListHub} from "../../context/ChatRoomsListHubContext.tsx";

const sortByFunction = (a: ChatRoomCardType, b: ChatRoomCardType, sortBy: number) => {
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
  selectedChatRoomId: string | null,
  setSelectedChatRoomId: (val: string) => void,
}

export default function ChatRoomsList({selectedChatRoomId, setSelectedChatRoomId}: ChatRoomsListProps) {
  const user = useUser();
  const chatRoomHub = useChatRoomHub();
  const chatRoomsListHub = useChatRoomsListHub();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState(SORT_BY_OPTIONS.NEWEST);
  const [chatRooms, setChatRooms] = useState<ChatRoomCardType[]>([]);
  const [chatRoomIdToRefresh, setChatRoomIdToRefresh] = useState<string | null>(null);

  const chatRoomsListQuery = useQuery<ChatRoomsByUserIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", "by-user-id", user.userId, "ChatRoomsList"],
    queryFn: async () => api.get<ChatRoomsByUserIdResponseType>(`ChatRooms/by-user-id?userId=${user.userId}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      setChatRooms(data.chatRooms)
    }
  })

  useQuery<ChatRoomsByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", chatRoomIdToRefresh, "ConversationContainer"],
    queryFn: async () => api.get<ChatRoomsByChatRoomIdResponseType>(`ChatRooms/${chatRoomIdToRefresh}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      setChatRooms(prev => {
        const index = prev.findIndex((chatRoom) => chatRoom.chatRoomId === data.chatRoom.chatRoomId);
        const updatedChatRoom = {
          ...data.chatRoom,
          isGroupChat: data.chatRoom.members.length > 2,
        };
        if (index !== -1) {
          const newChatRooms = [...prev];
          newChatRooms[index] = updatedChatRoom;
          return newChatRooms;
        } else {
          return [...prev, updatedChatRoom];
        }
      })
    },
    onSettled: () => {
      setChatRoomIdToRefresh(null);
    },
    enabled: !!chatRoomIdToRefresh,
  })

  useEffect(() => {
    if (selectedChatRoomId && chatRoomHub.isConnected) {
      chatRoomHub.connection?.invoke("JoinChatRoom", selectedChatRoomId)
    }

    return () => {
      if (selectedChatRoomId && chatRoomHub.isConnected) {
        chatRoomHub.connection?.invoke("LeaveChatRoom", selectedChatRoomId)
      }
    }
  }, [selectedChatRoomId, chatRoomHub.isConnected]);

  useEffect(() => {
    if (chatRoomsListHub.isConnected) {
      chatRoomsListHub.connection?.on("UpdateChatRoom", (chatRoomId: string) => {
        setChatRoomIdToRefresh(chatRoomId);
      });
    }
  }, [chatRoomsListHub])

  const onSelectChatRoom = async (chatRoom: ChatRoomCardType) => {
    if (selectedChatRoomId !== chatRoom.chatRoomId) {
      setSelectedChatRoomId(chatRoom.chatRoomId);
      navigate(`/chats/${chatRoom.chatRoomId}`)
    }
  }

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
      <div className={"mt-2.5 p-1.5"}>
        {chatRoomsListQuery.isLoading ? (
          <div>Loading...</div>
        ) : chatRoomsListQuery.error ? (
          <div>Error</div>
        ) : chatRooms
          .sort((a, b) => sortByFunction(a, b, sortBy))
          .map((chatRoom) => (
            <ChatRoomCard
              key={chatRoom.chatRoomId}
              isSelected={selectedChatRoomId === chatRoom.chatRoomId}
              chatRoom={chatRoom}
              onSelectChatRoom={() => onSelectChatRoom(chatRoom)}
            />
          ))}
      </div>
    </div>
  )
}