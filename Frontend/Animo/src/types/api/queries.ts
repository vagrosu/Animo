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

export type MessagesQueryType = {
  chatRoomId: string,
  senderId: string,
  text: string,
  userPhoto?: Blob,
  repliedMessageId?: string,
  isForwarded?: boolean
}

export type ChatRoomsQueryType = {
  name?: string,
  memberIds: string[]
}