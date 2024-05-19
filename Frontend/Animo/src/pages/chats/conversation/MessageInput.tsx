import {TextField} from "@mui/material";
import {useState} from "react";
import {useMutation} from "react-query";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {MessagesQueryType} from "../../../types/api/queries.tsx";
import {AxiosError} from "axios";
import {MessagesResponseType} from "../../../types/api/responses.tsx";
import {toast} from "react-toastify";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {ChatRoomType} from "../types.ts";

type MessageInputProps = {
  chatRoom: ChatRoomType,
}

export default function MessageInput ({chatRoom}: MessageInputProps) {
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
    if (!mutation.isLoading) {
      const newMessage = {
        chatRoomId: chatRoom.chatRoomId,
        senderId: user.userId,
        text: message,
        repliedMessageId: undefined,
        isForwarded: false,
      }

      mutation.mutate(newMessage)
    }
  }

  return (
    <TextField
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      label="Message"
      fullWidth
      InputProps={{
        endAdornment: (
          !mutation.isLoading ? (
            <SendRoundedIcon
              className={"cursor-pointer"}
              style={{fontSize: "1.5rem"}}
              onClick={onSendMessage}
            />
          ) : (
            <i className={"fa-md fa-solid fa-circle-notch fa-spin fa-lg"}/>
          )
        )
      }}
    />
  )
}