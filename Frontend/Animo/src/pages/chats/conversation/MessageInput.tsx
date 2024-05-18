import {TextField} from "@mui/material";
import {useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {MessagesQueryType} from "../../../types/api/queries.tsx";
import {AxiosError} from "axios";
import {MessagesResponseType} from "../../../types/api/responses.tsx";
import {toast} from "react-toastify";

type MessageInputProps = {
  chatRoomId: string,
}

export default function MessageInput ({chatRoomId}: MessageInputProps) {
  const user = useUser();
  const [message, setMessage] = useState<string>("");
  const queryClient = useQueryClient();

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
      //ToDo: check
      queryClient.invalidateQueries(["Messages", chatRoomId])
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const onSendMessage = () => {
    mutation.mutate({
      chatRoomId,
      senderId: user.userId,
      text: message,
      repliedMessageId: undefined,
      isForwarded: false,
    })
  }

  return (
    <TextField
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      label="Message"
      fullWidth
      InputProps={{
        endAdornment: (
          <i
            className={"fas fa-paper-plane cursor-pointer"}
            onClick={onSendMessage}
          />
        )
      }}
    />
  )
}