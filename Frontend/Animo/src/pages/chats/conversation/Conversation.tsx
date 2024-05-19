import {useQuery} from "react-query";
import {MessagesChatRoomIdResponseType, MessagesMessageIdResponseType} from "../../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {api} from "../../../services/api.tsx";
import {format, isToday, isYesterday, parseISO} from "date-fns";
import {ChatRoomType, MemberType, MessageType} from "../types.ts";
import {useEffect, useState} from "react";

const formatMessageDate = (date: string) => {
  const dateIso = parseISO(date);

  if (isToday(dateIso)) {
    return format(dateIso, "HH:mm");
  } else if (isYesterday(dateIso)) {
    return format(dateIso, "'Yesterday at' HH:mm");
  } else {
    return format(dateIso, "MMM dd 'at' HH:mm");
  }
}

type ConversationProps = {
  chatRoom: ChatRoomType,
  members: MemberType[]
}

export default function Conversation({chatRoom, members}: ConversationProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);

  const messagesQuery = useQuery<MessagesChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", chatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<MessagesChatRoomIdResponseType>(`Messages?chatRoomId=${chatRoom.chatRoomId}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      setMessages(data.textMessages.map(message => ({
        textMessageId: message.textMessageId,
        text: message.text,
        senderId: message.senderId,
        emotion: message.emotion,
        sentTime: message.sentTime,
        repliedMessageId: message.repliedMessageId,
        isForwarded: message.isForwarded
      })))
    }
  });

  useQuery<MessagesMessageIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", newMessageId],
    queryFn: async () => api.get<MessagesMessageIdResponseType>(`Messages/${newMessageId}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      setMessages([...messages, data.textMessage])
    },
    onSettled: () => {
      setNewMessageId(null);
    },
    enabled: !!newMessageId,
  });

  useEffect(() => {
    chatRoom.connection.on("ReceiveMessage", (messageId: string) => {
      setNewMessageId(messageId)
    })
  }, [chatRoom]);

  if (messagesQuery.isLoading) {
    return <div>Loading</div>
  }

  if (messagesQuery.error) {
    return <div>Error</div>
  }

  if (!messages.length) {
    return <div>No data</div>
  }

  return (
    <>
      {messages.map((textMessage) => (
        <div key={textMessage.textMessageId}>
          <div className={"flex gap-4"}>
            <p>{members.find(member => member.userId === textMessage.senderId)?.firstName}</p>
            <p>{textMessage.text}</p>
            <p>{textMessage.emotion}</p>
            <p>{formatMessageDate(textMessage.sentTime)}</p>
          </div>
        </div>
      ))}
    </>
  )
}