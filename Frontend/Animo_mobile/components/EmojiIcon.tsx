import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Emoji } from "emoji-mart-native";
import { localEmojis } from "../utils/helpers";

type EmojiIconProps = {
  emoji: string;
  size: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function EmojiIcon({ emoji, size, onPress, style = {} }: EmojiIconProps) {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      left: -7,
      top: -7,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Emoji onPress={onPress} emoji={emoji} useLocalImages={localEmojis} size={size} />
    </View>
  );
}
