import {useQuery, UseQueryResult} from "react-query";
import {
  MessagesByChatRoomIdResponseType,
  MessagesByMessageIdResponseType,
  UsersByChatRoomIdResponseType
} from "../../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {api} from "../../../services/api.tsx";
import {ChatRoomType, MessageType, SelectedChatRoomType} from "../types.ts";
import React, {useEffect, useRef, useState} from "react";
import Message from "../../../components/Message/Message.tsx";
import {differenceInCalendarDays, differenceInYears, format, isToday, isYesterday, parseISO} from "date-fns";
import {toast} from "react-toastify";

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
}

type ConversationProps = {
  selectedChatRoom: SelectedChatRoomType,
  chatRoom: ChatRoomType,
  membersQuery: UseQueryResult<UsersByChatRoomIdResponseType>
}

export default function Conversation({selectedChatRoom, chatRoom, membersQuery}: ConversationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const messagesQuery = useQuery<MessagesByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", "by-chat-room-id", chatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<MessagesByChatRoomIdResponseType>(`Messages/by-chat-room-id?chatRoomId=${chatRoom.chatRoomId}`)
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

  useQuery<MessagesByMessageIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", newMessageId],
    queryFn: async () => api.get<MessagesByMessageIdResponseType>(`Messages/${newMessageId}`)
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
    selectedChatRoom.connection?.on("ReceiveMessage", (messageId: string) => {
      setNewMessageId(messageId)
    })
  }, [chatRoom]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setIsAtBottom(target.scrollHeight - target.scrollTop <= target.clientHeight + 100);
  }

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
  }

  if (messagesQuery.isLoading || membersQuery.isLoading) {
    return <div>Loading</div>
  }

  if (messagesQuery.error) {
    toast.error("Error fetching messages")
  }

  if (membersQuery.error) {
    toast.error("Error fetching members")
  }

  const members = membersQuery.data?.members || [];

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={"bg-neutral-50 h-full overflow-y-scroll px-8"}
    >
      {messages.map((message, i) => {
        const isFirstFromDay = i === 0 || new Date(messages[i - 1].sentTime).getDate() !== new Date(message.sentTime).getDate();
        const isFirstFromGroup = isFirstFromDay || i === 0 || messages[i - 1].senderId !== message.senderId;
        const isLastFromGroup = i === messages.length - 1 || messages[i + 1].senderId !== message.senderId;
        const sender = members.find(member => member.userId === message.senderId);

        return (
          <React.Fragment key={message.textMessageId}>
            {isFirstFromDay && (
              <div className={"w-full flex items-center justify-center my-4"}>
                <div className={"border-[0.5px] opacity-70 border-blue-600 w-full"}/>
                <div className={"text-center text-sm text-blue-600 px-4"}>
                  {formatMessageGroupDate(message.sentTime)}
                </div>
                <div className={"border-b-[1px] opacity-70 border-blue-600 w-full"}/>
              </div>
            )}
            <Message
              message={message}
              sender={sender}
              isFirstFromGroup={isFirstFromGroup}
              isLastFromGroup={isLastFromGroup}
            />
          </React.Fragment>
        )
      })}
      {/*<div*/}
      {/*  className={`sticky flex items-center justify-center z-10 left-1/2 translate-x-[-50%] transition-[transform] ease-out ${isAtBottom ? "translate-y-[100px] w-0 h-0" : "translate-y-0 w-7 h-7"} bottom-14 bg-neutral-50 border-blue-600 border-[0.5px] rounded-full cursor-pointer`}*/}
      {/*  onClick={scrollToBottom}*/}
      {/*>*/}
      {/*  <i className={`fa-fw fa-solid fa-chevron-down text-blue-600 text-sm text-center transition-all ${isAtBottom ? "opacity-0" : ""}`}/>*/}
      {/*</div>*/}
    </div>
  )
}