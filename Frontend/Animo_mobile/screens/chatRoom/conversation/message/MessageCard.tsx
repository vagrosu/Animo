import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from "react-native";
import { MessageType } from "../../types";
import { format, parseISO } from "date-fns";
import { MessageContent } from "./MessageContent";
import COLORS from "../../../../utils/colors";
import { getEmojiNameByUnified } from "../../../../utils/helpers";
import MessageReactions from "./reactions/MessageReactions";
import ReactionPicker from "./reactions/ReactionPicker";
import { useUser } from "../../../../context/UserContext";
import { useReactionPicker } from "../../../../context/ReactionPickerContext";
import EmojiIcon from "../../../../components/EmojiIcon";

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

const getDynamicStyles = (isSentByUser: boolean, isFirstFromGroup: boolean) => {
  return StyleSheet.create({
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
      ...(isSentByUser
        ? {
            marginRight: 4,
          }
        : {
            marginLeft: 4,
          }),
    },

    reactionPickerStyle: {
      position: "absolute",
      top: -45,
      right: isSentByUser ? 0 : undefined,
      left: !isSentByUser ? 0 : undefined,
    },
  });
};

type MessageCardProps = {
  message: MessageType;
  senderFirstName: string;
  onReactionPress: () => void;
  onEmotionDataPress: () => void;
  isSentByUser: boolean;
  isFirstFromGroup: boolean;
  isReactionPickerVisible: boolean;
  style?: StyleProp<ViewStyle>;
};

export function MessageCard({
  message,
  senderFirstName,
  onReactionPress,
  onEmotionDataPress,
  isSentByUser,
  isFirstFromGroup,
  isReactionPickerVisible,
  style,
}: MessageCardProps) {
  const { userId } = useUser();
  const reactionPicker = useReactionPicker();
  const userReaction = message.reactions.find((reaction) => reaction.senderId === userId) || null;
  const dynamicStyles = getDynamicStyles(isSentByUser, isFirstFromGroup);

  const onReactionPickerOpen = () => {
    reactionPicker.setSelectedMessageId(message.textMessageId);
  };

  const onReactionPickerClose = () => {
    reactionPicker.setSelectedMessageId(null);
  };

  return (
    <View style={[styles.container, style]}>
      {!isSentByUser && isFirstFromGroup && <Text style={styles.senderNameText}>{senderFirstName}</Text>}
      <Pressable onPress={onEmotionDataPress} onLongPress={onReactionPickerOpen}>
        <View style={[styles.messageCardContainer, dynamicStyles.messageCardContainer]}>
          <MessageContent message={message} />
          <View style={[styles.messageMetadata, dynamicStyles.messageMetadata]}>
            <View style={dynamicStyles.emotionEmojiContainer}>
              <EmojiIcon
                emoji={getEmotionEmoji(message.emotion) || ""}
                size={15}
                onPress={onEmotionDataPress}
                onLongPress={onReactionPickerOpen}
              />
            </View>
            <Text style={styles.sentTimeText} numberOfLines={1}>
              {format(parseISO(message.sentTime), "HH:mm")}
            </Text>
          </View>
        </View>
      </Pressable>
      {!!message.reactions.length && (
        <MessageReactions reactions={message.reactions} onPress={onReactionPress} isSentByUser={isSentByUser} />
      )}
      {isReactionPickerVisible && (
        <ReactionPicker
          style={dynamicStyles.reactionPickerStyle}
          messageId={message.textMessageId}
          selectedReaction={userReaction}
          onClose={onReactionPickerClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

  sentTimeText: {
    color: COLORS.gray800,
    fontWeight: "100",
    fontSize: 12,
    lineHeight: 20,
  },
});
