import {useQuery} from "react-query";
import {MessagesChatRoomIdResponseType} from "../../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {api} from "../../../services/api.tsx";
import {format, isToday, isYesterday, parseISO} from "date-fns";

type ConversationProps = {
  chatRoomId: string;
}

function formatMessageDate(date: string) {
  const dateIso = parseISO(date);

  if (isToday(dateIso)) {
    return format(dateIso, "p");
  } else if (isYesterday(dateIso)) {
    return format(dateIso, "'Yesterday at' p");
  } else {
    return format(dateIso, "MMM dd 'at' p");
  }
}

export default function Conversation({chatRoomId}: ConversationProps) {
  const {data, isLoading, error} = useQuery<MessagesChatRoomIdResponseType, AxiosError | Error>({
    queryKey: ["Messages", chatRoomId, "ConversationContainer"],
    queryFn: async () => api.get<MessagesChatRoomIdResponseType>(`Messages/${chatRoomId}`)
      .then((res) => res.data)
  })

  if (isLoading) {
    return <div>Loading</div>
  }

  if (error) {
    return <div>Error</div>
  }

  if (!data || data.textMessages.length === 0) {
    return <div>No data</div>
  }

  return (
    <>
      {data.textMessages.map((textMessage) => (
        <div key={textMessage.textMessageId}>
          <div className={"flex gap-4"}>
            <p>{textMessage.text}</p>
            <p>{textMessage.emotion}</p>
            <p>{formatMessageDate(textMessage.sentTime)}</p>
          </div>
        </div>
      ))}
    </>
  )
}