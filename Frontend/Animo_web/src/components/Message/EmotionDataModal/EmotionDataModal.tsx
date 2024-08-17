import {MemberType, MessageType} from "../../../pages/chats/types.ts";
import {CircularProgress, Dialog, DialogContent, DialogTitle} from "@mui/material";
import {MessageDisplay} from "./MessageDisplay.tsx";
import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {AxiosError} from "axios";
import {GetEmotionsByMessageIdResponseType} from "../../../types/api/responses.ts";
import {getErrorMessage} from "../../../utils/helpers.ts";
import EmotionsChart from "./EmotionsChart.tsx";

type EmotionDataModalProps = {
  isOpen: boolean,
  toggle: () => void,
  message: MessageType,
  sender: MemberType | undefined,
}

export default function EmotionDataModal({isOpen, toggle, message, sender}: EmotionDataModalProps) {
  const emotionsQuery = useQuery<GetEmotionsByMessageIdResponseType ,AxiosError | Error>( {
    queryKey: ["Emotions", "by-message-id", message.textMessageId, "EmotionDataModal"],
    queryFn: async () => api.get<GetEmotionsByMessageIdResponseType>(`Emotions/by-message-id?messageId=${message.textMessageId}`)
      .then(res => res.data)
  })

  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      fullWidth
      maxWidth={"md"}
      classes={{
        paper: "!rounded-2xl !px-10 !py-8 !min-w-[40rem]"
      }}
    >
      <DialogTitle className={"flex items-center !px-0 !pt-0 !text-2xl"}>
        Emotions
        <i
          onClick={toggle}
          className={"fas fa-times text-xl absolute right-5 top-5 cursor-pointer"}
        />
      </DialogTitle>
      <DialogContent className={"!p-0"}>
        <MessageDisplay
          message={message}
          sender={sender}
        />
        {!emotionsQuery.isLoading && emotionsQuery.data ? (
          <div className={"flex mb-2"}>
            <EmotionsChart
              title={"Message"}
              emotions={emotionsQuery.data.messageEmotions}
            />
            <EmotionsChart
              title={"Selfie"}
              emotions={emotionsQuery.data.userPhotoEmotions}
            />
          </div>
        ) : emotionsQuery.error ? (
          <div className={"flex justify-center items-center h-44"}>
            <p className={"text-red-500"}>{getErrorMessage(emotionsQuery.error)}</p>
          </div>
        ) : (
          <div className={"flex justify-center items-center h-44"}>
            <CircularProgress/>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}