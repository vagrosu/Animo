import {HubConnection} from "@microsoft/signalr";

export type SelectedChatRoomType = {
  chatRoomId?: string,
  connection?: HubConnection,
}

export type ChatRoomType = {
  chatRoomId: string,
  name: string,
  lastUsedTime: string,
  lastActivity?: string,
}

export type MessageType = {
  textMessageId: string,
  text: string,
  senderId: string,
  emotion: string,
  sentTime: string,
  repliedMessageId?: string,
  isForwarded?: boolean,
}

export type MemberType = {
  userId: string,
  userName: string,
  firstName: string,
  lastName: string,
}