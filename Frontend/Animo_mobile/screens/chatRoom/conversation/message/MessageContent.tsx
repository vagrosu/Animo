import { Linking, Pressable, StyleSheet, Text } from "react-native";
import { isValidHttpUrl } from "../../../../utils/helpers";
import { MessageType } from "../../types";
import COLORS from "../../../../utils/colors";
import { useCallback } from "react";
import Toast from "react-native-toast-message";

type MessageContentProps = {
  message: MessageType;
};

export function MessageContent({ message }: MessageContentProps) {
  const isLink = isValidHttpUrl(message.text);

  if (isLink) {
    const onUrlPress = useCallback(async () => {
      const supported = await Linking.canOpenURL(message.text);

      if (supported) {
        await Linking.openURL(message.text);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "This link is not supported.",
        });
      }
    }, [message.text]);

    return (
      <Pressable onPress={onUrlPress}>
        <Text style={style.link}>{message.text}</Text>
      </Pressable>
    );
  }

  return <Text>{message.text}</Text>;
}

const style = StyleSheet.create({
  link: {
    color: COLORS.blue600,
  },
});
