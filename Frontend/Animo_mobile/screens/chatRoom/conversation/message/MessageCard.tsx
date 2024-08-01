import { View, Text, StyleSheet } from "react-native";
import { MessageType } from "../../types";
import { format, parseISO } from "date-fns";
import { MessageContent } from "./MessageContent";
import COLORS from "../../../../utils/colors";
import Icon from "react-native-ico-sensa-emoji-vectors";

const getEmotionEmoji = (emotion: string) => {
  switch (emotion.toLowerCase()) {
    case "neutral":
      return "1f610";
    case "joy":
      return "1f604";
    case "sadness":
      return "1f622";
    case "anger":
      return "1f621";
    case "fear":
      return "1f628";
    case "surprise":
      return "1f62e";
    case "disgust":
      return "1f922";
    default:
      return "26a0-fe0f";
  }
};

type MessageCardProps = {
  message: MessageType;
  senderFirstName: string;
  toggleEmotionDataModal?: () => void;
  isSentByUser: boolean;
  isFirstFromGroup: boolean;
};

export function MessageCard({ message, senderFirstName, toggleEmotionDataModal, isSentByUser, isFirstFromGroup }: MessageCardProps) {
  const dynamicStyles = StyleSheet.create({
    messageCardContainer: {
      gap: 6,
      backgroundColor: isSentByUser ? COLORS.blue100 : COLORS.zinc200,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginLeft: !isSentByUser ? 8 : undefined,
      borderTopLeftRadius: isSentByUser || !isFirstFromGroup ? 16 : undefined,
      borderTopRightRadius: isSentByUser ? (!isFirstFromGroup ? 16 : undefined) : 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },

    messageMetadata: {
      flexDirection: "row",
      justifyContent: "flex-end",

      ...(isSentByUser
        ? {
            paddingLeft: 20,
          }
        : {
            flexDirection: "row-reverse",
            paddingRight: 20,
          }),
    },
  });

  return (
    <View style={styles.container}>
      {!isSentByUser && isFirstFromGroup && <Text style={styles.senderNameText}>{senderFirstName}</Text>}
      <View style={dynamicStyles.messageCardContainer}>
        <MessageContent message={message} />
        <View style={dynamicStyles.messageMetadata}>
          <View
          // onClick={toggleEmotionDataModal}
          // className={`flex items-center content-center ${
          //   toggleEmotionDataModal ? "cursor-pointer" : "cursor-default"
          // } select-none text-sm ${isSentByUser ? "mr-1" : "ml-1"}`}
          >
            <Icon name="astonished-face" height="40" width="40" />
          </View>
          <Text style={styles.sentTimeText} numberOfLines={1}>
            {format(parseISO(message.sentTime), "HH:mm")}
          </Text>
        </View>
      </View>
      {/* {!!message.reactions.length && <MessageReactions reactions={message.reactions} isSentByUser={isSentByUser} />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    minWidth: 100,
  },

  senderNameText: {
    fontWeight: "100",
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 8,
  },

  sentTimeText: {
    color: COLORS.gray800,
    fontWeight: "100",
    fontSize: 12,
    lineHeight: 20,
  },
});
