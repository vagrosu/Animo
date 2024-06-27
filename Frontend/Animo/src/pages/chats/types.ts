export type ChatRoomType = {
  chatRoomId: string,
  name: string,
  members: MemberType[],
  isGroupChat: boolean,
  lastUsedTime: string,
  lastActivity?: string,
}

export type ChatRoomCardType = {
  chatRoomId: string,
  name: string,
  isGroupChat: boolean,
  lastUsedTime: string,
  lastActivity?: string,
}

export type ReactionType = {
  messageReactionId: string,
  senderId: string,
  emoji: string,
}

export type MessageType = {
  textMessageId: string,
  text: string,
  senderId: string,
  emotion: string,
  sentTime: string,
  reactions: ReactionType[],
  repliedMessageId?: string,
  isForwarded?: boolean,
}

export type MemberType = {
  userId: string,
  userName: string,
  firstName: string,
  lastName: string,
}