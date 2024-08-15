import { Pressable, Text, StyleSheet } from "react-native";
import { getEmojiNameByUnified } from "../../../../../../utils/helpers";
import EmojiIcon from "../../../../../../components/EmojiIcon";
import COLORS from "../../../../../../utils/colors";

type ReactionsTypesListItemProps = {
  isSelected: boolean;
  onSelect: () => void;
} & (
  | {
      reaction: string;
      count: number;
    }
  | {
      text: string;
    }
);

export default function ReactionsTypesListItem(props: ReactionsTypesListItemProps) {
  const emoji = "reaction" in props ? getEmojiNameByUnified(props.reaction) || "" : "";

  return (
    <Pressable
      onPress={props.onSelect}
      style={[styles.reactionsTypesListItem, props.isSelected ? styles.reactionsTypesSelectedListItem : null]}
    >
      {"reaction" in props ? (
        <>
          <EmojiIcon emoji={emoji} size={16} onPress={props.onSelect} />
          <Text>{props.count}</Text>
        </>
      ) : (
        <>
          <Text>{props.text}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  reactionsTypesListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    width: 48,
    borderRadius: 14,
    gap: 4,
  },

  reactionsTypesSelectedListItem: {
    backgroundColor: COLORS.gray350,
  },
});
