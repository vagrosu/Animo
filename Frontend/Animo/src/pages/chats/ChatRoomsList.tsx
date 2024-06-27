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
import {decryptTextMessage} from "../../utils/helpers.ts";
import useWindowDimensions from "../../utils/hooks.ts";
import {EXPANDED_CHAT_ROOM_LIST_MIN_WIDTH} from "./ChatsPage.tsx";

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
  isChatRoomListExpanded: boolean,
  setIsChatRoomListExpanded: (val: boolean) => void,
  selectedChatRoomId: string | null,
  setSelectedChatRoomId: (val: string) => void,
}

export default function ChatRoomsList({isChatRoomListExpanded, setIsChatRoomListExpanded, selectedChatRoomId, setSelectedChatRoomId}: ChatRoomsListProps) {
  const user = useUser();
  const chatRoomHub = useChatRoomHub();
  const chatRoomsListHub = useChatRoomsListHub();
  const navigate = useNavigate();
  const isFloating = useWindowDimensions().width < EXPANDED_CHAT_ROOM_LIST_MIN_WIDTH;

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState(SORT_BY_OPTIONS.NEWEST);
  const [chatRooms, setChatRooms] = useState<ChatRoomCardType[]>([]);
  const [chatRoomIdToRefresh, setChatRoomIdToRefresh] = useState<string | null>(null);

  const chatRoomsListQuery = useQuery<ChatRoomsByUserIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", "by-user-id", user.userId, "ChatRoomsList"],
    queryFn: async () => api.get<ChatRoomsByUserIdResponseType>(`ChatRooms/by-user-id?userId=${user.userId}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      setChatRooms(data.chatRooms.map((chatRoom) => ({
        chatRoomId: chatRoom.chatRoomId,
        name: chatRoom.name,
        lastUsedTime: chatRoom.lastUsedTime,
        lastActivity: decryptTextMessage(chatRoom.lastActivity),
        isGroupChat: chatRoom.isGroupChat,
      })))
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
          chatRoomId: data.chatRoom.chatRoomId,
          name: data.chatRoom.name,
          lastUsedTime: data.chatRoom.lastUsedTime,
          lastActivity: decryptTextMessage(data.chatRoom.lastActivity),
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

  useEffect(() => {
    setSearch("");
  }, [isChatRoomListExpanded]);

  const onSelectChatRoom = async (chatRoom: ChatRoomCardType) => {
    if (selectedChatRoomId !== chatRoom.chatRoomId) {
      setSelectedChatRoomId(chatRoom.chatRoomId);
      navigate(`/chats/${chatRoom.chatRoomId}`)
    }
  }

  const displayedChatRooms = chatRooms
    .filter((chatRoom) => chatRoom.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortByFunction(a, b, sortBy))

  return (
    <div className={`flex flex-col bg-white ${isChatRoomListExpanded ? `min-w-[17.5rem] w-[24vw] ${isFloating ? "absolute z-50" : "relative"}` : ""} max-w-[23rem] h-full border-r border-gray-200`}>
      <div className={`flex items-center ${isChatRoomListExpanded ? "absolute right-5" : "justify-center"} h-[4.25rem]`}>
        <i className={`fa-solid fa-chevron-${isChatRoomListExpanded ? "left" : "right"} p-2 font-bold text-xl mt-[-0.125rem] text-blue-600 cursor-pointer`}
          onClick={() => setIsChatRoomListExpanded(!isChatRoomListExpanded)}
        />
      </div>
      {isChatRoomListExpanded && (
        <div className={"pt-7 px-5"}>
          <h1 className={"font-bold text-3xl leading-8"}>
            Messages
          </h1>
          <SearchInput
            className={"mt-5"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SortByDropdown
            sortBy={sortBy}
            setSortBy={setSortBy}
            className={"ml-2.5 mt-2"}
          />
        </div>
      )}
      <div className={`${isChatRoomListExpanded ? "mt-2.5" : "mt-0.5"} p-1.5 overflow-y-scroll`}>
        {chatRoomsListQuery.isLoading ? (
          <div>Loading...</div>
        ) : chatRoomsListQuery.error ? (
          <div>Error</div>
        ) : displayedChatRooms.length ? (
          displayedChatRooms.map((chatRoom) => (
            <ChatRoomCard
              key={chatRoom.chatRoomId}
              isChatRoomListExpanded={isChatRoomListExpanded}
              isSelected={selectedChatRoomId === chatRoom.chatRoomId}
              chatRoom={chatRoom}
              onSelectChatRoom={() => onSelectChatRoom(chatRoom)}
            />
          ))
        ) : !chatRooms.length ? (
          <div className={"text-center text-gray-400 mt-5"}>
            {isChatRoomListExpanded ? "Create a new chat" : "No chats"}
          </div>
        ) : (
          <div className={"text-center text-gray-400 mt-5"}>
            No chats match your search
          </div>
        )}
      </div>
    </div>
  )
}