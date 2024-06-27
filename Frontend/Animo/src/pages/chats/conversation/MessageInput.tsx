import {InputBase} from "@mui/material";
import {useRef, useState} from "react";
import {useMutation} from "react-query";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {CreateMessagesQueryType} from "../../../types/api/queries.ts";
import {AxiosError} from "axios";
import {CreateMessagesResponseType} from "../../../types/api/responses.ts";
import {toast} from "react-toastify";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {base64ImageToBlob, encryptTextMessage, getErrorMessage} from "../../../utils/helpers.ts";
import {Camera} from "react-camera-pro";
import {CameraType} from "../../../types/common.ts";

type MessageInputProps = {
  selectedChatRoomId: string,
}

export default function MessageInput ({selectedChatRoomId}: MessageInputProps) {
  const user = useUser();
  const cameraRef = useRef<CameraType>(null);
  const [message, setMessage] = useState("");

  const mutation = useMutation<CreateMessagesResponseType, Error | AxiosError, CreateMessagesQueryType>({
    mutationFn: async (query) => {
      const formData = new FormData();
      formData.append("chatRoomId", query.chatRoomId);
      formData.append("senderId", query.senderId);
      formData.append("text", query.text);
      user.isSelfieConsentGiven && query.userPhoto && formData.append("userPhoto", query.userPhoto);
      query.repliedMessageId && formData.append("repliedMessageId", query.repliedMessageId);
      query.isForwarded && formData.append("isForwarded", query.isForwarded.toString());

      return api.post(
        "Messages",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      )
    },
    onSuccess: () => {
      setMessage("");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  })

  const onSendMessage = async () => {
    if (!selectedChatRoomId) {
      toast.error("Chat room not found")
      return
    }

    if (mutation.isLoading || !message.trim()) {
      return
    }

    let userPhotoBlob: Blob | null = null;
    if (user.isSelfieConsentGiven) {
      if (cameraRef.current) {
        try {
          const userPhoto = cameraRef.current.takePhoto();
          if (userPhoto) {
            userPhotoBlob = base64ImageToBlob(userPhoto as string);
          } else {
            console.log("Failed to capture photo")
            toast.error("Failed to capture photo")
          }
        } catch (e) {
          console.log("Failed to capture photo", e)
          toast.error("Failed to capture photo")
        }
      } else {
        console.log("Camera not found")
        toast.error("Camera not found")
      }
    }

    const messageData = {
      chatRoomId: selectedChatRoomId,
      senderId: user.userId,
      text: encryptTextMessage(message),
      ...(user.isSelfieConsentGiven && userPhotoBlob && {userPhoto: userPhotoBlob}),
      repliedMessageId: undefined,
      isForwarded: false,
    }

    mutation.mutate(messageData)
  }

  return (
    <div className={"flex items-center px-5 py-2 border-t border-gray-200"}>
      {user.isSelfieConsentGiven && <div className={"invisible"}>
        <Camera
          ref={cameraRef}
          errorMessages={{
            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
            switchCamera:
              'It is not possible to switch camera to different one because there is only one video device accessible.',
            canvas: 'Canvas is not supported.',
          }}
          facingMode={"user"}
        />
      </div>}
      <InputBase
        value={message}
        onKeyUp={(e) => e.key === "Enter" && onSendMessage()}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={"Type your message here..."}
        className={"w-full px-5 py-2 rounded-2xl border-0 bg-neutral-100"}
      />
      <div className={"flex items-center justify-center w-7 h-7 ml-5 text-blue-600 hover:text-blue-500"}>
        {!mutation.isLoading ? (
          <SendRoundedIcon
            className={message.trim() ? "cursor-pointer" : "cursor-not-allowed text-blue-300"}
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