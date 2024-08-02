import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { ChatRoomsByChatRoomIdResponseType } from "../../types/api/responses";
import { AxiosError } from "axios";
import { createApiInstance } from "../../services/api";
import { ChatRoomType } from "./types";
import NoContent from "../../components/NoContent";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../utils/colors";
import ChatRoomHubContextProvider from "../../context/ChatRoomHubContext";
import ConversationContainer from "./conversation/ConversationContainer";

export default function ChatRoomScreen() {
  const route = useRoute();
  const selectedChatRoomId = route.params?.chatRoomId;

  const chatRoomQuery = useQuery<ChatRoomsByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", selectedChatRoomId, "ConversationContainer"],
    queryFn: async () => {
      const api = await createApiInstance();
      return api.get<ChatRoomsByChatRoomIdResponseType>(`ChatRooms/${selectedChatRoomId}`).then((res) => res.data);
    },
  });

  if (chatRoomQuery.isLoading) {
    return <ActivityIndicator size={20} color={COLORS.blue600} />;
  }

  if (chatRoomQuery.isError || !chatRoomQuery.data) {
    return (
      <NoContent
        title={"Failed to load chats"}
        subtitle={"Please try again later"}
        icon={faCircleExclamation}
        iconColor={COLORS.red600}
        style={styles.noContent}
      />
    );
  }

  const chatRoom: ChatRoomType = {
    chatRoomId: chatRoomQuery.data.chatRoom.chatRoomId,
    name: chatRoomQuery.data.chatRoom.name,
    members: chatRoomQuery.data.chatRoom.members,
    isGroupChat: chatRoomQuery.data.chatRoom.members.length > 2,
    lastUsedTime: chatRoomQuery.data.chatRoom.lastUsedTime,
  };

  return (
    <View style={styles.container}>
      <ChatRoomHubContextProvider>
        <ConversationContainer chatRoom={chatRoom} />
      </ChatRoomHubContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  noContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
