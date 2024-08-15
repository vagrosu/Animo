import { useEffect } from "react";
import { useChatRoomHub } from "../../../context/ChatRoomHubContext";
import Conversation from "./Conversation";
import ConversationHeader from "./ConversationHeader";
import MessageInput from "./MessageInput";
import { ChatRoomType } from "../types";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { useSafeAreaStyle } from "../../../utils/hooks";

type ConversationContainerProps = {
  chatRoom: ChatRoomType;
};

export default function ConversationContainer({ chatRoom }: ConversationContainerProps) {
  const chatRoomHub = useChatRoomHub();
  const safeAreaStyle = useSafeAreaStyle();

  useEffect(() => {
    if (chatRoom.chatRoomId && chatRoomHub.isConnected) {
      chatRoomHub.connection?.invoke("JoinChatRoom", chatRoom.chatRoomId);
    }

    return () => {
      if (chatRoom.chatRoomId && chatRoomHub.isConnected) {
        chatRoomHub.connection?.invoke("LeaveChatRoom", chatRoom.chatRoomId);
      }
    };
  }, [chatRoom.chatRoomId, chatRoomHub.isConnected]);

  return (
    <>
      <ConversationHeader chatRoom={chatRoom} />
      <KeyboardAvoidingView behavior={"padding"} style={styles.keyboardAvoidingView}>
        <Conversation chatRoom={chatRoom} />
        <MessageInput selectedChatRoomId={chatRoom.chatRoomId} />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
});
