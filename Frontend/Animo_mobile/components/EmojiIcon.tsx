import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Emoji } from "emoji-mart-native";
import { localEmojis } from "../utils/helpers";
import { forwardRef } from "react";

type EmojiIconProps = {
  emoji: string;
  size: number;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const EmojiIcon = forwardRef<View, EmojiIconProps>(({ emoji, size, onPress, onLongPress, style = {} }, ref) => {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      left: -7,
      top: -7,
    },
  });

  return (
    <View ref={ref} style={[styles.container, style]}>
      <Emoji emoji={emoji} useLocalImages={localEmojis} size={size} onPress={onPress} onLongPress={onLongPress} />
    </View>
  );
});

export default EmojiIcon;
