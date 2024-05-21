import {MessageType} from "../../pages/chats/types.ts";
import {isValidHttpUrl} from "../../utils/helpers.ts";
import {Link} from "react-router-dom";

type MessageContentProps = {
  message: MessageType
}

export function MessageContent({message}: MessageContentProps) {
  const isLink = isValidHttpUrl(message.text);

  if (isLink) {
    return (
      <Link
        to={message.text}
        target={"_blank"}
        rel={"noopener noreferrer"}
        className={"text-blue-600 cursor-pointer hover:underline"}>
        {message.text}
      </Link>
    )
  }

  return (
    <p>{message.text}</p>
  )
}