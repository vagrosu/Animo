import {useQuery} from "react-query";
import {
  MessagesByChatRoomIdResponseType,
  MessagesByMessageIdResponseType
} from "../../../types/api/responses.ts";
import {AxiosError} from "axios";
import {api} from "../../../services/api.tsx";
import {ChatRoomType, MessageType} from "../types.ts";
import React, {useEffect, useRef, useState} from "react";
import Message from "../../../components/Message/Message.tsx";
import {differenceInCalendarDays, differenceInYears, format, isToday, isYesterday, parseISO} from "date-fns";
import {toast} from "react-toastify";
import {useChatRoomHub} from "../../../context/ChatRoomHubContext.tsx";
import {decryptTextMessage} from "../../../utils/helpers.ts";

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
  chatRoom: ChatRoomType,
}

export default function Conversation({chatRoom}: ConversationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {connection} = useChatRoomHub();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [messageToUpdateId, setMessageToUpdateId] = useState<string | null>(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);

  const messagesQuery = useQuery<MessagesByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", "by-chat-room-id", chatRoom.chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<MessagesByChatRoomIdResponseType>(`Messages/by-chat-room-id?chatRoomId=${chatRoom.chatRoomId}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      setMessages(data.textMessages.map(message => ({
        textMessageId: message.textMessageId,
        text: decryptTextMessage(message.text),
        senderId: message.senderId,
        emotion: message.emotion,
        sentTime: message.sentTime,
        reactions: message.reactions,
        repliedMessageId: message.repliedMessageId,
        isForwarded: message.isForwarded
      })))
    }
  });

  useQuery<MessagesByMessageIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", newMessageId || messageToUpdateId],
    queryFn: async () => api.get<MessagesByMessageIdResponseType>(`Messages/${newMessageId || messageToUpdateId}`)
      .then((res) => res.data),
    onSuccess: (data) => {
      const messageData = {
        ...data.textMessage,
        text: decryptTextMessage(data.textMessage.text)
      }

      if (newMessageId) {
        setMessages([...messages, messageData])
      } else if (messageToUpdateId) {
        const updatedMessages = messages.map(message => {
          if (message.textMessageId === messageToUpdateId) {
            return messageData
          }

          return message;
        })

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
      setNewMessageId(messageId)
    })

    connection?.on("UpdateMessage", (messageId: string) => {
      setMessageToUpdateId(messageId)
    })
  }, [connection, chatRoom]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (containerRef.current) {
      setShowScrollIcon(containerRef.current?.scrollHeight > containerRef.current?.clientHeight && target.scrollHeight - target.scrollTop > target.clientHeight + 100);
    } else {
      setShowScrollIcon(false);
    }
  }

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior: "smooth"});
  }

  if (messagesQuery.isLoading) {
    return <div>Loading</div>
  }

  if (messagesQuery.error) {
    toast.error("Error fetching messages")
  }

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
        const sender = chatRoom.members.find(member => member.userId === message.senderId);

        return (
          <React.Fragment key={message.textMessageId}>
            {isFirstFromDay && (
              <div className={"w-full flex items-center justify-center my-4"}>
                <div className={"border-[0.5px] opacity-70 border-blue-600 w-full"}/>
                <div className={"text-center text-sm text-blue-600 text-nowrap px-4"}>
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
      <div
        className="sticky w-0 h-0 z-10 bottom-0 left-1/2 translate-x-[-50%] cursor-pointer"
        onClick={scrollToBottom}
      >
        <div className={`flex items-center justify-center w-7 h-7 absolute bottom-14 ${!showScrollIcon ? "hidden" : ""} border-blue-600 border-[0.5px] bg-neutral-50 rounded-full`}>
          <i className={"fa-fw fa-solid fa-chevron-down text-blue-600 text-xl"}/>
        </div>
      </div>
    </div>
  )
}