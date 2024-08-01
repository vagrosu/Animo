import { StyleSheet, Text } from "react-native";
import { isValidHttpUrl } from "../../../../utils/helpers";
import { MessageType } from "../../types";
import COLORS from "../../../../utils/colors";

type MessageContentProps = {
  message: MessageType;
};

export function MessageContent({ message }: MessageContentProps) {
  const isLink = isValidHttpUrl(message.text);

  if (isLink) {
    return (
      <Text style={style.link}>{message.text}</Text>
      //     <Link to={message.text} target={"_blank"} rel={"noopener noreferrer"} className={"text-blue-600 cursor-pointer hover:underline"}>
      //       {message.text}
      //     </Link>
    );
  }

  return <Text>{message.text}</Text>;
}

const style = StyleSheet.create({
  link: {
    color: COLORS.blue600,
  },
});
