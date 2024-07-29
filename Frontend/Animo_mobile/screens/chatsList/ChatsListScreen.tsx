import { View, Text, Button, Pressable, StyleSheet, FlatList, ScrollView, VirtualizedList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "../../components/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faComments, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { ChatRoomCardType } from "./types";
import { createApiInstance } from "../../services/api";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { ChatRoomsByUserIdResponseType } from "../../types/api/responses";
import { decryptTextMessage } from "../../utils/helpers";
import SortByDropdown, { SORT_BY_OPTIONS } from "./components/SortByDropdown";
import ChatRoomCard from "./components/ChatRoomCard";
import COLORS from "../../utils/colors";
import NoContent from "../../components/NoContent";

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

export default function ChatsListScreen() {
  const navigation = useNavigation();
  const user = useUser();

  const [chatRooms, setChatRooms] = useState<ChatRoomCardType[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(SORT_BY_OPTIONS.NEWEST);

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

  const onOpenDrawer = () => {
    navigation.toggleDrawer();
  };

  const onSelectChatRoom = async (chatRoom: ChatRoomCardType) => {
    // if (selectedChatRoomId !== chatRoom.chatRoomId) {
    //   setSelectedChatRoomId(chatRoom.chatRoomId);
    //   navigate(`/chats/${chatRoom.chatRoomId}`);
    // }
  };

  const displayedChatRooms = chatRooms
    .filter((chatRoom) => chatRoom.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortByFunction(a, b, sortBy));

  return (
    <View style={styles.container}>
      <View style={[styles.titleContainer, styles.pageHorizontalPadding]}>
        <Pressable onPress={onOpenDrawer}>
          <FontAwesomeIcon icon={faBars} size={24} style={styles.menuIcon} />
        </Pressable>
        <Text style={styles.title}>Messages</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={[styles.filtersContainer, styles.pageHorizontalPadding]}>
          <SearchInput value={search} onChangeText={setSearch} />
          <SortByDropdown />
        </View>
        <View style={styles.chatRoomListContainer}>
          {chatRoomsListQuery.isLoading ? (
            <View style={styles.noContent}>
              <Text>Loading...</Text>
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
                <ChatRoomCard style={styles.pageHorizontalPadding} chatRoom={item} onSelectChatRoom={() => onSelectChatRoom(item)} />
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pageHorizontalPadding: {
    paddingHorizontal: 16,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 16,
  },

  menuIcon: {
    color: COLORS.blue600,
  },

  scrollViewContentContainer: {
    flexGrow: 1,
  },

  title: {
    lineHeight: 32,
    fontWeight: "700",
    fontSize: 30,
  },

  filtersContainer: {
    paddingHorizontal: 8,
    marginTop: 20,
    gap: 10,
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
