import { Pressable, StyleSheet, View } from "react-native";
import { useUser } from "../../../../context/UserContext";
import { MemberType, MessageType } from "../../types";
import IconAvatar from "../../../../components/IconAvatar";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { MessageCard } from "./MessageCard";
import { useReactionPicker } from "../../../../context/ReactionPickerContext";

type MessageProps = {
  message: MessageType;
  sender: MemberType | undefined;
  onUserPress: (() => void) | null;
  onReactionPress: () => void;
  onEmotionDataPress: () => void;
  isFirstFromGroup: boolean;
  isLastFromGroup: boolean;
};

export default function Message({
  message,
  sender,
  onUserPress,
  onReactionPress,
  onEmotionDataPress,
  isFirstFromGroup,
  isLastFromGroup,
}: MessageProps) {
  const { userId } = useUser();
  const reactionPicker = useReactionPicker();
  const isReactionPickerVisible = message.textMessageId === reactionPicker.selectedMessageId;
  const isSentByUser = message.senderId === userId;
  const hasReactions = message.reactions.length > 0;

  const dynamicStyles = StyleSheet.create({
    container: {
      position: "relative",
      flexDirection: isSentByUser ? "row-reverse" : "row",
      marginLeft: !isFirstFromGroup ? 28 : undefined,
      marginBottom: isLastFromGroup ? 18 : hasReactions ? 12 : 4,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {isFirstFromGroup && !isSentByUser && (
        <Pressable onPress={onUserPress}>
          <IconAvatar icon={faUser} style={styles.userAvatar} size={28} />
        </Pressable>
      )}
      <MessageCard
        message={message}
        senderFirstName={sender?.firstName || "Unknown"}
        style={styles.messageCard}
        onReactionPress={onReactionPress}
        onEmotionDataPress={onEmotionDataPress}
        isSentByUser={isSentByUser}
        isFirstFromGroup={isFirstFromGroup}
        isReactionPickerVisible={isReactionPickerVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  messageCard: {
    maxWidth: "80%",
  },

  userAvatar: {
    marginTop: 20,
  },
});
