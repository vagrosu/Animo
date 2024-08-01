import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import COLORS from "../../../utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useMutation } from "react-query";
import { CreateMessagesResponseType } from "../../../types/api/responses";
import { AxiosError } from "axios";
import { CreateMessagesQueryType } from "../../../types/api/queries";
import { useUser } from "../../../context/UserContext";
import { createApiInstance } from "../../../services/api";
import Toast from "react-native-toast-message";
import { encryptTextMessage, getErrorMessage } from "../../../utils/helpers";

type MessageInputProps = {
  selectedChatRoomId: string;
};

export default function MessageInput({ selectedChatRoomId }: MessageInputProps) {
  const user = useUser();
  const [message, setMessage] = useState("");

  const mutation = useMutation<CreateMessagesResponseType, Error | AxiosError, CreateMessagesQueryType>({
    mutationFn: async (query) => {
      const api = await createApiInstance();
      const formData = new FormData();
      formData.append("chatRoomId", query.chatRoomId);
      formData.append("senderId", query.senderId);
      formData.append("text", query.text);
      user.isSelfieConsentGiven && query.userPhoto && formData.append("userPhoto", query.userPhoto);
      query.repliedMessageId && formData.append("repliedMessageId", query.repliedMessageId);
      query.isForwarded && formData.append("isForwarded", query.isForwarded.toString());

      return api.post("Messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      setMessage("");
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Error", text2: getErrorMessage(error) });
    },
  });

  const onSendMessage = async () => {
    if (!selectedChatRoomId) {
      Toast.show({ type: "error", text1: "Error", text2: "Chat room not found" });
      return;
    }

    if (mutation.isLoading || !message.trim()) {
      return;
    }

    // let userPhotoBlob: Blob | null = null;
    // if (user.isSelfieConsentGiven) {
    //   if (cameraRef.current) {
    //     try {
    //       const userPhoto = cameraRef.current.takePhoto();
    //       if (userPhoto) {
    //         userPhotoBlob = base64ImageToBlob(userPhoto as string);
    //       } else {
    //         console.log("Failed to capture photo");
    //         toast.error("Failed to capture photo");
    //       }
    //     } catch (e) {
    //       console.log("Failed to capture photo", e);
    //       toast.error("Failed to capture photo");
    //     }
    //   } else {
    //     console.log("Camera not found");
    //     toast.error("Camera not found");
    //   }
    // }

    const messageData = {
      chatRoomId: selectedChatRoomId,
      senderId: user.userId,
      text: encryptTextMessage(message),
      // ...(user.isSelfieConsentGiven && userPhotoBlob && { userPhoto: userPhotoBlob }),
      repliedMessageId: undefined,
      isForwarded: false,
    };

    mutation.mutate(messageData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={styles.messageInput}
        placeholder={"Type your message here..."}
        multiline
        numberOfLines={4}
      />
      <View style={styles.sendButton}>
        {!mutation.isLoading ? (
          <Pressable onPress={onSendMessage}>
            <Ionicons name={"send-sharp"} size={20} color={message.trim() ? COLORS.blue600 : COLORS.blue300} />
          </Pressable>
        ) : (
          <ActivityIndicator size={20} color={COLORS.blue600} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },

  messageInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: COLORS.neutral100,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },

  sendButton: {
    paddingVertical: 7,
  },
});
