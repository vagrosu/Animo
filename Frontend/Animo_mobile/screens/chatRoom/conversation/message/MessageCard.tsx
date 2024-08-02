import { View, Text, StyleSheet, Image } from "react-native";
import { MessageType } from "../../types";
import { format, parseISO } from "date-fns";
import { MessageContent } from "./MessageContent";
import COLORS from "../../../../utils/colors";
import { Emoji } from "emoji-mart-native";
import { getEmojiNameByUnified, localEmojis } from "../../../../utils/helpers";
import MessageReactions from "./reactions/MessageReactions";

const getEmotionEmoji = (emotion: string) => {
  let unified = "26a0-fe0f";
  switch (emotion.toLowerCase()) {
    case "neutral":
      unified = "1f610";
      break;
    case "joy":
      unified = "1f604";
      break;
    case "sadness":
      unified = "1f622";
      break;
    case "anger":
      unified = "1f621";
      break;
    case "fear":
      unified = "1f628";
      break;
    case "surprise":
      unified = "1f62e";
      break;
    case "disgust":
      unified = "1f922";
      break;
    default:
      unified = "26a0-fe0f";
      break;
  }

  return getEmojiNameByUnified(unified);
};

type MessageCardProps = {
  message: MessageType;
  senderFirstName: string;
  toggleEmotionDataModal?: () => void;
  isSentByUser: boolean;
  isFirstFromGroup: boolean;
};

export function MessageCard({
  message,
  senderFirstName,
  toggleEmotionDataModal,
  isSentByUser,
  isFirstFromGroup,
}: MessageCardProps) {
  const dynamicStyles = StyleSheet.create({
    messageCardContainer: {
      backgroundColor: isSentByUser ? COLORS.blue100 : COLORS.zinc200,
      marginLeft: !isSentByUser ? 8 : undefined,
      borderTopLeftRadius: isSentByUser || !isFirstFromGroup ? 16 : undefined,
      borderTopRightRadius: isSentByUser ? (!isFirstFromGroup ? 16 : undefined) : 16,
    },

    messageMetadata: {
      ...(isSentByUser
        ? {
            paddingLeft: 20,
          }
        : {
            flexDirection: "row-reverse",
            paddingRight: 20,
          }),
    },

    emotionEmojiContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: 15,
      height: 15,
      ...(isSentByUser
        ? {
            marginRight: 4,
          }
        : {
            marginLeft: 4,
          }),
    },
  });

  return (
    <View style={styles.container}>
      {!isSentByUser && isFirstFromGroup && <Text style={styles.senderNameText}>{senderFirstName}</Text>}
      <View style={[styles.messageCardContainer, dynamicStyles.messageCardContainer]}>
        <MessageContent message={message} />
        <View style={[styles.messageMetadata, dynamicStyles.messageMetadata]}>
          <View style={[styles.emotionEmojiContainer, dynamicStyles.emotionEmojiContainer]}>
            <Emoji emoji={getEmotionEmoji(message.emotion)} useLocalImages={localEmojis} size={15} />
          </View>
          <Text style={styles.sentTimeText} numberOfLines={1}>
            {format(parseISO(message.sentTime), "HH:mm")}
          </Text>
        </View>
      </View>
      {!!message.reactions.length && <MessageReactions reactions={message.reactions} isSentByUser={isSentByUser} />}
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

  messageCardContainer: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  messageMetadata: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  emotionEmojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 15,
    height: 15,
  },

  sentTimeText: {
    color: COLORS.gray800,
    fontWeight: "100",
    fontSize: 12,
    lineHeight: 20,
  },
});
