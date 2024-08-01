import { StyleSheet, View } from "react-native";
import { useUser } from "../../../../context/UserContext";
import { MemberType, MessageType } from "../../types";
import IconAvatar from "../../../../components/IconAvatar";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { MessageCard } from "./MessageCard";
import COLORS from "../../../../utils/colors";

type MessageProps = {
  message: MessageType;
  sender: MemberType | undefined;
  isFirstFromGroup: boolean;
  isLastFromGroup: boolean;
};

export default function Message({ message, sender, isFirstFromGroup, isLastFromGroup }: MessageProps) {
  const { userId } = useUser();
  const isSentByUser = message.senderId === userId;
  const hasReactions = message.reactions.length > 0;
  const userReaction = message.reactions.find((reaction) => reaction.senderId === userId);

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: isSentByUser ? "row-reverse" : "row",
      marginLeft: !isFirstFromGroup ? 28 : undefined,
      marginBottom: isLastFromGroup ? 18 : hasReactions ? 16 : 4,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {isFirstFromGroup && !isSentByUser && <IconAvatar icon={faUser} style={styles.userAvatar} size={28} />}
      <MessageCard
        message={message}
        senderFirstName={sender?.firstName || "Unknown"}
        toggleEmotionDataModal={() => {}}
        isSentByUser={isSentByUser}
        isFirstFromGroup={isFirstFromGroup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  userAvatar: {
    marginTop: 20,
  },
});
