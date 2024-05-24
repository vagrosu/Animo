import {InputBase} from "@mui/material";
import {useState} from "react";
import {useMutation} from "react-query";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {MessagesQueryType} from "../../../types/api/queries.tsx";
import {AxiosError} from "axios";
import {MessagesResponseType} from "../../../types/api/responses.tsx";
import {toast} from "react-toastify";
import SendRoundedIcon from '@mui/icons-material/SendRounded';

type MessageInputProps = {
  selectedChatRoomId: string,
}

export default function MessageInput ({selectedChatRoomId}: MessageInputProps) {
  const user = useUser();
  const [message, setMessage] = useState<string>("");

  const mutation = useMutation<MessagesResponseType, Error | AxiosError, MessagesQueryType>({
    mutationFn: async (query) => api.post(
      "Messages",
      {
        chatRoomId: query.chatRoomId,
        senderId: query.senderId,
        text: query.text,
        repliedMessageId: query.repliedMessageId,
        isForwarded: query.isForwarded,
      }
    ),
    onSuccess: () => {
      setMessage("");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const onSendMessage = async () => {
    if (!selectedChatRoomId) {
      toast.error("Chat room not found")
      return
    }

    if (!mutation.isLoading) {
      const newMessage = {
        chatRoomId: selectedChatRoomId,
        senderId: user.userId,
        text: message,
        repliedMessageId: undefined,
        isForwarded: false,
      }

      mutation.mutate(newMessage)
    }
  }

  return (
    <div className={"flex items-center px-5 py-2 border-t border-gray-200"}>
      <InputBase
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={"Type your message here..."}
        className={"w-full px-5 py-2 rounded-2xl border-0 bg-neutral-100"}
      />
      <div className={"flex items-center justify-center w-7 h-7 ml-5 text-blue-600 hover:text-blue-500"}>
        {!mutation.isLoading ? (
          <SendRoundedIcon
            className={"cursor-pointer"}
            style={{fontSize: "1.5rem"}}
            onClick={onSendMessage}
          />
        ) : (
          <i className={"fa-solid fa-circle-notch fa-spin fa-lg"}/>
        )}
      </div>
    </div>
  )
}