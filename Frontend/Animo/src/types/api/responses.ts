import {AxiosResponse} from "axios";

// Naming schema: {Entity}ResponseType

type baseResponse = {
  success: boolean,
  statusCode: number,
  message: string | null,
  validationsErrors: string[] | null
}

type ChatRoomMemberType = {
  userId: string,
  userName: string,
  firstName: string,
  lastName: string,
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
    members: ChatRoomMemberType[],
    lastUsedTime: string,
    lastActivity: string,
  }
} & baseResponse;

export type ChatRoomsByUserIdResponseType = {
  chatRooms: {
    chatRoomId: string,
    name: string,
    isGroupChat: boolean,
    lastUsedTime: string,
    lastActivity: string,
  }[]
} & baseResponse;

type ReactionType = {
  messageReactionId: string,
  senderId: string,
  emoji: string,
}

type ResponseTextMessageType = {
  textMessageId: string,
  text: string,
  senderId: string,
  emotion: string,
  sentTime: string,
  reactions: ReactionType[],
  repliedMessageId?: string,
  isForwarded?: boolean,
}

export type MessagesByMessageIdResponseType = {
  textMessage: ResponseTextMessageType
} & baseResponse;

export type MessagesByChatRoomIdResponseType = {
  textMessages: ResponseTextMessageType[]
} & baseResponse;

export type CreateMessagesResponseType = AxiosResponse<{
  textMessageId: string,
  text: string,
  sentTime: string,
  isForwarded?: boolean,
} & baseResponse>;

export type CreateChatRoomResponseType = AxiosResponse<{
  chatRoom: {
    chatRoomId: string,
    name: string,
    members: ChatRoomMemberType[]
  }
} & baseResponse>;

export type CreateOrUpdateMessageReactionResponseType = AxiosResponse<{
  messageReactionId: string,
  messageId: string,
  senderId: string,
  emoji: string,
} & baseResponse>;

export type DeleteMessageReactionResponseType = AxiosResponse<baseResponse>;

export type UsersByChatRoomIdResponseType = {
  members: ChatRoomMemberType[]
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

type EmotionType = {
  isSuccess: boolean,
  errorMessage?: string,
  neutral: number,
  joy: number,
  surprise: number,
  sadness: number,
  disgust: number,
  anger: number,
  fear: number
}

export type GetEmotionsByMessageIdResponseType = {
  messageEmotions: EmotionType,
  userPhotoEmotions: EmotionType
} & baseResponse;