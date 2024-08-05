import { StyleSheet, Pressable } from "react-native";
import { ReactionType } from "../../../types";
import { Emoji } from "emoji-mart-native";
import { getEmojiNameByUnified, localEmojis } from "../../../../../utils/helpers";
import COLORS from "../../../../../utils/colors";
import OutsidePressHandler from "react-native-outside-press";
import { useMutation } from "react-query";
import {
  CreateOrUpdateMessageReactionResponseType,
  DeleteMessageReactionResponseType,
} from "../../../../../types/api/responses";
import { AxiosError } from "axios";
import { CreateOrUpdateMessageReactionsQueryType, DeleteMessageReactionsQueryType } from "../../../../../types/api/queries";
import { createApiInstance } from "../../../../../services/api";
import { useUser } from "../../../../../context/UserContext";

type ReactionPickerProps = {
  messageId: string;

  selectedReaction: ReactionType | null;
  onClose: () => void;
};

const reactions = ["1f44d", "2764-fe0f", "1f603", "1f622", "1f64f", "1f44e", "1f621"];

export default function ReactionPicker({ messageId, selectedReaction, onClose }: ReactionPickerProps) {
  const user = useUser();

  const modifyMessageReactionMutation = useMutation<
    CreateOrUpdateMessageReactionResponseType,
    Error | AxiosError,
    CreateOrUpdateMessageReactionsQueryType
  >({
    mutationFn: async (data) => {
      const api = await createApiInstance();
      return api.put(`Messages/reactions`, {
        messageId: data.messageId,
        senderId: data.senderId,
        emoji: data.emoji,
      });
    },
  });

  const deleteMessageReactionMutation = useMutation<
    DeleteMessageReactionResponseType,
    Error | AxiosError,
    DeleteMessageReactionsQueryType
  >({
    mutationFn: async (data) => {
      const api = await createApiInstance();
      return api.delete(`Messages/reactions/${data.messageReactionId}`);
    },
  });

  const onSelectReaction = (reactionUnified: string) => {
    if (selectedReaction && reactionUnified === selectedReaction.emoji) {
      deleteMessageReactionMutation.mutate({
        messageReactionId: selectedReaction.messageReactionId,
      });
    } else {
      modifyMessageReactionMutation.mutate({
        messageId: messageId,
        senderId: user.userId,
        emoji: reactionUnified,
      });
    }

    onClose();
  };

  return (
    <OutsidePressHandler onOutsidePress={onClose} style={styles.container}>
      {reactions.map((reaction) => (
        <Pressable
          key={reaction}
          onPress={() => onSelectReaction(reaction)}
          style={[styles.emojiContainer, selectedReaction?.emoji === reaction && styles.selectedEmojiContainer]}
        >
          <Emoji
            emoji={getEmojiNameByUnified(reaction)}
            useLocalImages={localEmojis}
            onPress={() => onSelectReaction(reaction)}
            size={24}
          />
        </Pressable>
      ))}
    </OutsidePressHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    padding: 2,
    gap: 2,
    borderRadius: 14,
    backgroundColor: COLORS.neutral50,
    borderColor: COLORS.neutral200,
    borderWidth: 1,
  },

  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 24,
    maxHeight: 24,
    padding: 16,
  },

  selectedEmojiContainer: {
    backgroundColor: COLORS.gray200,
    borderRadius: 8,
  },
});
