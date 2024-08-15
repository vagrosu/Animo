import { View, Text, StyleSheet } from "react-native";
import { ReactionType } from "../../../../types";
import IconAvatar from "../../../../../../components/IconAvatar";
import EmojiIcon from "../../../../../../components/EmojiIcon";
import { getEmojiNameByUnified } from "../../../../../../utils/helpers";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../../../../../utils/colors";

type ReactionsListItemProps = {
  isLastItem: boolean;
  reaction: ReactionType;
};

export default function ReactionsListItem({ isLastItem, reaction }: ReactionsListItemProps) {
  return (
    <View style={[styles.reactionsListItemContainer, isLastItem ? styles.reactionsListLastItemContainer : null]}>
      <View style={styles.reactionSenderContainer}>
        <IconAvatar icon={faUser} size={28} />
        <Text style={styles.textColor}>
          {reaction.senderFirstName} {reaction.senderLastName}
        </Text>
      </View>
      <EmojiIcon emoji={getEmojiNameByUnified(reaction.emoji) || ""} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  reactionsListItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray300,
  },

  reactionsListLastItemContainer: {
    borderBottomWidth: 0,
  },

  reactionSenderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  textColor: {
    color: COLORS.gray600,
  },
});
