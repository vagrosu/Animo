type baseResponse = {
  success: boolean,
  statusCode: number,
  message: string | null,
  validationErrors: string[] | null
}

export type AuthenticationLoginResponseType = string;

export type AuthenticationRegisterResponseType = null;

export type AuthenticationCurrentUserResponseType = {
  user: {
    isAuthenticated: boolean,
    userId: string,
    claims: {
      [key: string]: string
    }
  }
} & baseResponse;

export type ChatRoomsByChatRoomIdResponseType = {
  chatRoom: {
    chatRoomId: string,
    name: string,
    lastUsedTime: string,
  }
} & baseResponse;

export type ChatRoomsByUserIdResponseType = {
  chatRooms: {
    chatRoomId: string,
    name: string,
    lastUsedTime: string,
    lastActivity: string,
  }[]
} & baseResponse;

type ResponseTextMessageType = {
  textMessageId: string,
  text: string,
  senderId: string,
  emotion: string,
  sentTime: string,
  repliedMessageId?: string,
  isForwarded?: boolean,
}

export type MessagesByMessageIdResponseType = {
  textMessage: ResponseTextMessageType
} & baseResponse;

export type MessagesByChatRoomIdResponseType = {
  textMessages: ResponseTextMessageType[]
} & baseResponse;

export type MessagesResponseType = {
  textMessageId: string,
  text: string,
  sentTime: string,
  isForwarded?: boolean,
}

export type UsersByChatRoomIdResponseType = {
  members: {
    userId: string,
    userName: string,
    firstName: string,
    lastName: string,
  }[]
} & baseResponse;

export type UsersBySearchResponseType = {
  users: {
    userId: string,
    userName: string,
    firstName: string,
    lastName: string,
  }[]
} & baseResponse;
