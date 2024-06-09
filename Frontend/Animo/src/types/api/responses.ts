import {AxiosResponse} from "axios";

// Naming schema: {Entity}ResponseType

type baseResponse = {
  success: boolean,
  statusCode: number,
  message: string | null,
  validationsErrors: string[] | null
}

export type AuthenticationLoginResponseType = string;

export type AuthenticationRegisterResponseType = null;

export type AuthenticationCurrentUserResponseType = {
  user: {
    isAuthenticated: boolean,
    userId: string,
    firstName: string,
    lastName: string,
    isSelfieConsentAsked: boolean,
    isSelfieConsentGiven: boolean,
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
    lastActivity: string,
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

export type MessagesResponseType = AxiosResponse<{
  textMessageId: string,
  text: string,
  sentTime: string,
  isForwarded?: boolean,
} & baseResponse>;

export type ChatRoomResponseType = AxiosResponse<{
  chatRoom: {
    chatRoomId: string,
    name: string,
    members: {
      userId: string,
      userName: string,
      firstName: string,
      lastName: string,
    }[]
  }
} & baseResponse>;

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

export type UsersUpdateSelfieConsentResponseType = {
  selfieConsent: {
    isSelfieConsentGiven: boolean,
  }
} & baseResponse;

export type UsersByUserIdResponseType = {
  user: {
    userId: string,
    username?: string,
    firstName: string,
    lastName: string,
    email?: string,
    phoneNumber?: string,
    isSelfieConsentGiven: boolean,
  }
} & baseResponse;