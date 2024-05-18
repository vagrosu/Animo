import {HubConnection} from "@microsoft/signalr";

export type ChatRoomType = {
  chatRoomId: string,
  connection: HubConnection,
  name: string,
  lastUsedTime: string,
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