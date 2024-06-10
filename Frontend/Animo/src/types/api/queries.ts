export type AuthenticationLoginQueryType = {
  identifier: string,
  password: string
}

export type AuthentificationRegisterQueryType = {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string
}

export type CreateMessagesQueryType = {
  chatRoomId: string,
  senderId: string,
  text: string,
  userPhoto?: Blob,
  repliedMessageId?: string,
  isForwarded?: boolean
}

export type CreateChatRoomsQueryType = {
  name?: string,
  memberIds: string[]
}

export type UsersUpdateSelfieConsentQueryType = {
  userId: string,
  isSelfieConsentGiven: boolean,
}