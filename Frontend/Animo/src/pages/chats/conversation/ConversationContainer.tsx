import {ChatRoomType} from "../types.ts";
import Conversation from "./Conversation.tsx";
import MessageInput from "./MessageInput.tsx";
import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {ChatRoomsByChatRoomIdResponseType} from "../../../types/api/responses.ts";
import {AxiosError} from "axios";
import ConversationHeader from "./ConversationHeader.tsx";
import {useEffect, useState} from "react";
import MembersList from "./MembersList/MembersList.tsx";
import useWindowDimensions from "../../../utils/hooks.ts";

type ConversationContainerProps = {
  selectedChatRoomId: string,
}

export const OPENED_CHAT_ROOM_MEMBERS_LIST_MIN_WIDTH = 1280;

export default function ConversationContainer ({selectedChatRoomId}: ConversationContainerProps) {
  const screenWidth = useWindowDimensions().width;
  const [isMembersListOpen, setIsMembersListOpen] = useState(true);

  const chatRoomQuery = useQuery<ChatRoomsByChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["ChatRooms", selectedChatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<ChatRoomsByChatRoomIdResponseType>(`ChatRooms/${selectedChatRoomId}`)
      .then((res) => res.data)
  })

  useEffect(() => {
    setIsMembersListOpen(screenWidth >= OPENED_CHAT_ROOM_MEMBERS_LIST_MIN_WIDTH);
  }, [screenWidth]);

  const toggleMembersList = () => {
    setIsMembersListOpen(!isMembersListOpen);
  }

  if (chatRoomQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (chatRoomQuery.isError || !chatRoomQuery.data) {
    return <div>Error</div>
  }

  const chatRoom: ChatRoomType = {
    chatRoomId: chatRoomQuery.data.chatRoom.chatRoomId,
    name: chatRoomQuery.data.chatRoom.name,
    members: chatRoomQuery.data.chatRoom.members,
    isGroupChat: chatRoomQuery.data.chatRoom.members.length > 2,
    lastUsedTime: chatRoomQuery.data.chatRoom.lastUsedTime,
  };

  return (
    <div className={"flex w-full h-full"}>
    <div className={"flex flex-col w-full h-full"}>
      <ConversationHeader
        chatRoom={chatRoom}
        toggleMembersList={toggleMembersList}
      />
      <Conversation chatRoom={chatRoom}/>
      <MessageInput selectedChatRoomId={selectedChatRoomId} />
    </div>
    {isMembersListOpen && (
      <MembersList
        name={chatRoom.name}
        members={chatRoom.members}
        isGroupChat={chatRoom.isGroupChat}
        toggleMembersList={toggleMembersList}
      />
    )}
    </div>
  )
}