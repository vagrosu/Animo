import { FlatList, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import NoContent from "../../components/NoContent";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faComments, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import COLORS from "../../utils/colors";
import ChatRoomCard from "./components/ChatRoomCard";
import { ChatRoomCardType } from "./types";
import { SORT_BY_OPTIONS } from "./components/SortByDropdown";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "react-query";
import { ChatRoomsByChatRoomIdResponseType, ChatRoomsByUserIdResponseType } from "../../types/api/responses";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { createApiInstance } from "../../services/api";
import { decryptTextMessage } from "../../utils/helpers";
import { useChatRoomsListHub } from "../../context/ChatRoomsListHubContext";

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
};

type ChatRoomsListProps = {
  search: string;
  sortBy: number;
};

export default function ChatRoomsList({ search, sortBy }: ChatRoomsListProps) {
  const navigation = useNavigation();
  const user = useUser();
  const chatRoomsListHub = useChatRoomsListHub();

  const [chatRooms, setChatRooms] = useState<ChatRoomCardType[]>([]);
  const [chatRoomIdToRefresh, setChatRoomIdToRefresh] = useState<string | null>(null);

  const chatRoomsListQuery = useQuery<ChatRoomsByUserIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", "by-user-id", user.userId, "ChatRoomsList"],
    queryFn: async () => {
      const api = await createApiInstance();
      return api.get<ChatRoomsByUserIdResponseType>(`ChatRooms/by-user-id?userId=${user.userId}`).then((res) => res.data);
    },
    onSuccess: (data) => {
      setChatRooms(
        data.chatRooms.map((chatRoom) => ({
          chatRoomId: chatRoom.chatRoomId,
          name: chatRoom.name,
          lastUsedTime: chatRoom.lastUsedTime,
          lastActivity: decryptTextMessage(chatRoom.lastActivity),
          isGroupChat: chatRoom.isGroupChat,
        }))
      );
    },
  });

  useQuery<ChatRoomsByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", chatRoomIdToRefresh, "ConversationContainer"],
    queryFn: async () => {
      const api = await createApiInstance();
      return api.get<ChatRoomsByChatRoomIdResponseType>(`ChatRooms/${chatRoomIdToRefresh}`).then((res) => res.data);
    },
    onSuccess: (data) => {
      setChatRooms((prev) => {
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
      });
    },
    onSettled: () => {
      setChatRoomIdToRefresh(null);
    },
    enabled: !!chatRoomIdToRefresh,
  });

  useEffect(() => {
    if (chatRoomsListHub.isConnected) {
      chatRoomsListHub.connection?.on("UpdateChatRoom", (chatRoomId: string) => {
        setChatRoomIdToRefresh(chatRoomId);
      });
    }
  }, [chatRoomsListHub]);

  // useEffect(() => {
  //   if (selectedChatRoomId && chatRoomHub.isConnected) {
  //     chatRoomHub.connection?.invoke("JoinChatRoom", selectedChatRoomId);
  //   }

  //   return () => {
  //     if (selectedChatRoomId && chatRoomHub.isConnected) {
  //       chatRoomHub.connection?.invoke("LeaveChatRoom", selectedChatRoomId);
  //     }
  //   };
  // }, [selectedChatRoomId, chatRoomHub.isConnected]);

  const onSelectChatRoom = async (chatRoom: ChatRoomCardType) => {
    navigation.navigate("ChatRoom", { chatRoomId: chatRoom.chatRoomId });
  };

  const displayedChatRooms = chatRooms
    .filter((chatRoom) => chatRoom.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortByFunction(a, b, sortBy));

  return (
    <View style={styles.chatRoomListContainer}>
      {chatRoomsListQuery.isLoading ? (
        <View style={styles.noContent}>
          <ActivityIndicator size={20} color={COLORS.blue600} />
        </View>
      ) : chatRoomsListQuery.error ? (
        <NoContent
          title={"Failed to load chats"}
          subtitle={"Please try again later"}
          icon={faCircleExclamation}
          iconColor={COLORS.red600}
          style={styles.noContent}
        />
      ) : displayedChatRooms.length ? (
        <FlatList
          data={displayedChatRooms}
          renderItem={({ item }) => (
            <ChatRoomCard
              style={styles.pageHorizontalPadding}
              chatRoom={item}
              onSelectChatRoom={() => onSelectChatRoom(item)}
            />
          )}
          keyExtractor={(item) => item.chatRoomId}
          scrollEnabled={false}
        />
      ) : !chatRooms.length ? (
        <NoContent
          title={"You have no chats"}
          subtitle={"Start a new private or group conversation"}
          icon={faComments}
          style={styles.noContent}
        />
      ) : (
        <NoContent
          title={"No chats match your search"}
          subtitle={"Try searching for something else"}
          icon={faEyeSlash}
          style={styles.noContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageHorizontalPadding: {
    paddingHorizontal: 16,
  },

  chatRoomListContainer: {
    flex: 1,
    marginTop: 12,
  },

  noContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
