import { View, Text, StyleSheet, Pressable } from "react-native";
import { getEmojiNameByUnified, localEmojis } from "../../../../../utils/helpers";
import { ReactionType } from "../../../types";
import { Emoji } from "emoji-mart-native";
import COLORS from "../../../../../utils/colors";

type MessageReactionsProps = {
  reactions: ReactionType[];
  isSentByUser: boolean;
  onPress: () => void;
};

export default function MessageReactions({ reactions, onPress, isSentByUser }: MessageReactionsProps) {
  const emojiSet = Array.from(new Set(reactions.map((reaction) => reaction.emoji)));

  const dynamicStyles = StyleSheet.create({
    container: {
      left: isSentByUser ? -4 : undefined,
      right: isSentByUser ? undefined : -4,
    },
  });

  return (
    <Pressable style={[styles.container, dynamicStyles.container]} onPress={onPress}>
      {emojiSet.slice(0, 3).map((emoji, i) => (
        <View key={i} style={styles.emojiContainer}>
          <Emoji emoji={getEmojiNameByUnified(emoji)} onPress={onPress} useLocalImages={localEmojis} size={12} />
        </View>
      ))}
      <Text style={styles.reactionsNumber}>{reactions.length}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginVertical: -4,
    marginHorizontal: -6,
    backgroundColor: COLORS.gray300,
    borderRadius: 999,
    zIndex: 10,
    bottom: -6,
  },

  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 12,
    height: 12,
  },

  reactionsNumber: {
    color: COLORS.gray800,
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 2,
  },
});
