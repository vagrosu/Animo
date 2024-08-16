import { ActivityIndicator, StyleSheet, View, Text, ScrollView } from "react-native";
import ModalComponent from "../../../../../components/ModalComponent";
import { MemberType, MessageType } from "../../../types";
import { useQuery } from "react-query";
import { GetEmotionsByMessageIdResponseType } from "../../../../../types/api/responses";
import { AxiosError } from "axios";
import { createApiInstance } from "../../../../../services/api";
import COLORS from "../../../../../utils/colors";
import MessageDisplay from "./MessageDisplay";
import EmotionsChart from "./EmotionsChart";
import { useState } from "react";

type EmotionDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: MessageType;
  sender: MemberType;
};

export default function EmotionDataModal({ isOpen, onClose, message, sender }: EmotionDataModalProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<{ chartTitle: string; emotion: string } | null>(null);

  const emotionsQuery = useQuery<GetEmotionsByMessageIdResponseType, AxiosError | Error>({
    queryKey: ["Emotions", "by-message-id", message.textMessageId, "EmotionDataModal"],
    queryFn: async () => {
      const api = await createApiInstance();
      return api
        .get<GetEmotionsByMessageIdResponseType>(`Emotions/by-message-id?messageId=${message.textMessageId}`)
        .then((res) => res.data);
    },
  });

  const onEmotionPress = (chartTitle: string, emotion: string) => {
    if (selectedEmotion?.chartTitle === chartTitle && selectedEmotion.emotion === emotion) {
      setSelectedEmotion(null);
      return;
    }

    setSelectedEmotion({ chartTitle, emotion });
  };

  return (
    <ModalComponent isOpen={isOpen} title={"Emotions"} onClose={onClose} modalStyle={styles.modal}>
      <ScrollView alwaysBounceVertical={false}>
        <MessageDisplay message={message} sender={sender} />
        <View style={styles.chartContainer}>
          {!emotionsQuery.isLoading && emotionsQuery.data ? (
            <View style={styles.chartsContainer}>
              <EmotionsChart
                title={"Message"}
                emotions={emotionsQuery.data.messageEmotions}
                selectedEmotion={selectedEmotion?.chartTitle === "message" ? selectedEmotion.emotion : null}
                onEmotionPress={(emotion: string) => onEmotionPress("message", emotion)}
              />
              <EmotionsChart
                title={"Selfie"}
                emotions={emotionsQuery.data.userPhotoEmotions}
                selectedEmotion={selectedEmotion?.chartTitle === "selfie" ? selectedEmotion.emotion : null}
                onEmotionPress={(emotion: string) => onEmotionPress("selfie", emotion)}
              />
            </View>
          ) : emotionsQuery.error ? (
            <Text>{emotionsQuery.error.message}</Text>
          ) : (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator color={COLORS.blue600} />
            </View>
          )}
        </View>
      </ScrollView>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  modal: {
    maxHeight: 500,
    overflow: "hidden",
    height: undefined,
  },

  chartsContainer: {
    marginTop: 20,
    gap: 24,
  },

  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  activityIndicatorContainer: {
    paddingVertical: 64,
  },
});
