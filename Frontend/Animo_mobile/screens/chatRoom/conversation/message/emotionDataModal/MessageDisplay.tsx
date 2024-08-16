import { faUser } from "@fortawesome/free-solid-svg-icons";
import { MemberType, MessageType } from "../../../types";
import { MessageCard } from "../MessageCard";
import IconAvatar from "../../../../../components/IconAvatar";
import { StyleSheet, View } from "react-native";

type MessageDisplayProps = {
  message: MessageType;
  sender: MemberType;
};

export default function MessageDisplay({ message, sender }: MessageDisplayProps) {
  const messageWithoutReactions = { ...message, reactions: [] };

  return (
    <View style={styles.container}>
      <IconAvatar icon={faUser} style={styles.userAvatar} size={28} />
      <MessageCard
        message={messageWithoutReactions}
        senderFirstName={sender.firstName}
        onReactionPress={() => {}}
        onEmotionDataPress={() => {}}
        style={styles.messageCard}
        isSentByUser={false}
        isFirstFromGroup={true}
        isReactionPickerVisible={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },

  userAvatar: {
    marginTop: 20,
  },

  messageCard: {
    flex: 1,
  },
});
