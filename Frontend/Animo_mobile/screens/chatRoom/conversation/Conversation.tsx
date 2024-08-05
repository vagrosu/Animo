import { FlatList, StyleSheet, Text, View } from "react-native";
import { ChatRoomType, MessageType } from "../types";
import { useChatRoomHub } from "../../../context/ChatRoomHubContext";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { MessagesByChatRoomIdResponseType, MessagesByMessageIdResponseType } from "../../../types/api/responses";
import { AxiosError } from "axios";
import { createApiInstance } from "../../../services/api";
import { decryptTextMessage } from "../../../utils/helpers";
import { differenceInCalendarDays, differenceInYears, format, isToday, isYesterday, parseISO } from "date-fns";
import COLORS from "../../../utils/colors";
import Message from "./message/Message";
import ReactionPickerContextProvider from "../../../context/ReactionPickerContext";

const formatMessageGroupDate = (date: string) => {
  const dateIso = parseISO(date);
  const today = new Date();

  if (isToday(dateIso)) {
    return format(dateIso, "'Today'");
  } else if (isYesterday(dateIso)) {
    return format(dateIso, "'Yesterday'");
  } else if (differenceInCalendarDays(today, dateIso) <= 7) {
    return format(dateIso, "EEEE");
  } else if (differenceInYears(today, dateIso) < 1) {
    return format(dateIso, "dd MMM");
  } else {
    return format(dateIso, "dd MMM, yyyy");
  }
};

type ConversationProps = {
  chatRoom: ChatRoomType;
};

export default function Conversation({ chatRoom }: ConversationProps) {
  const { connection } = useChatRoomHub();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [messageToUpdateId, setMessageToUpdateId] = useState<string | null>(null);

  const messagesQuery = useQuery<MessagesByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", "by-chat-room-id", chatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => {
      const api = await createApiInstance();
      return api
        .get<MessagesByChatRoomIdResponseType>(`Messages/by-chat-room-id?chatRoomId=${chatRoom.chatRoomId}`)
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      setMessages(
        data.textMessages.map((message) => ({
          textMessageId: message.textMessageId,
          text: decryptTextMessage(message.text),
          senderId: message.senderId,
          emotion: message.emotion,
          sentTime: message.sentTime,
          reactions: message.reactions,
          repliedMessageId: message.repliedMessageId,
          isForwarded: message.isForwarded,
        }))
      );
    },
  });

  useQuery<MessagesByMessageIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", newMessageId || messageToUpdateId],
    queryFn: async () => {
      const api = await createApiInstance();
      return api
        .get<MessagesByMessageIdResponseType>(`Messages/${newMessageId || messageToUpdateId}`)
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      const messageData = {
        ...data.textMessage,
        text: decryptTextMessage(data.textMessage.text),
      };

      if (newMessageId) {
        setMessages([...messages, messageData]);
      } else if (messageToUpdateId) {
        const updatedMessages = messages.map((message) => {
          if (message.textMessageId === messageToUpdateId) {
            return messageData;
          }

          return message;
        });

        setMessages(updatedMessages);
      }
    },
    onSettled: () => {
      setNewMessageId(null);
      setMessageToUpdateId(null);
    },
    enabled: !!newMessageId || !!messageToUpdateId,
  });

  useEffect(() => {
    connection?.on("ReceiveMessage", (messageId: string) => {
      setNewMessageId(messageId);
    });

    connection?.on("UpdateMessage", (messageId: string) => {
      setMessageToUpdateId(messageId);
    });
  }, [connection, chatRoom]);

  return (
    <View style={styles.container}>
      <ReactionPickerContextProvider>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.textMessageId}
          inverted
          contentContainerStyle={{ flexDirection: "column-reverse", flexGrow: 1 }}
          renderItem={({ item: message, index: i }) => {
            const isFirstFromDay =
              i === 0 || new Date(messages[i - 1].sentTime).getDate() !== new Date(message.sentTime).getDate();
            const isFirstFromGroup = isFirstFromDay || i === 0 || messages[i - 1].senderId !== message.senderId;
            const isLastFromGroup = i === messages.length - 1 || messages[i + 1].senderId !== message.senderId;
            const sender = chatRoom.members.find((member) => member.userId === message.senderId);

            return (
              <View style={styles.messagesListContainer}>
                {isFirstFromDay && (
                  <View style={styles.dateContainer}>
                    <View style={styles.dateBorder} />
                    <Text style={styles.dateText}>{formatMessageGroupDate(message.sentTime)}</Text>
                    <View style={styles.dateBorder} />
                  </View>
                )}
                <Message
                  message={message}
                  sender={sender}
                  isFirstFromGroup={isFirstFromGroup}
                  isLastFromGroup={isLastFromGroup}
                />
              </View>
            );
          }}
        />
      </ReactionPickerContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },

  messagesListContainer: {
    paddingHorizontal: 16,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dateBorder: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.blue600,
    opacity: 0.7,
  },

  dateText: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.blue600,
  },
});
