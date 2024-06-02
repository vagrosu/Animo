import {ChatRoomType} from "../pages/chats/types.ts";
import {Avatar} from "@mui/material";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  isToday,
  isYesterday,
  parseISO
} from "date-fns";

const formatChatRoomCardDate = (date: string) => {
  const dateIso = parseISO(date);
  const today = new Date();

  if (isToday(dateIso)) {
    return format(dateIso, "HH:mm");
  } else if (isYesterday(dateIso)) {
    return 'Yesterday';
  } else if (differenceInDays(today, dateIso) <= 7) {
    const daysAgo = differenceInDays(today, dateIso);
    return `${daysAgo} days ago`;
  } else if (differenceInMonths(today, dateIso) >= 1 && differenceInYears(today, dateIso) === 0) {
    return format(dateIso, "MMM");
  } else if (differenceInYears(today, dateIso) > 0) {
    return format(dateIso, "yyyy");
  } else {
    return format(dateIso, "MMM dd");
  }
}

type ChatRoomCardProps = {
  isSelected: boolean,
  chatRoom: ChatRoomType,
  onSelectChatRoom: () => void,
}

export default function ChatRoomCard({isSelected, chatRoom, onSelectChatRoom}: ChatRoomCardProps) {

  return (
    <div
      onClick={onSelectChatRoom}
      className={`flex items-center mt-0.5 px-3.5 py-2.5 ${isSelected ? "bg-gray-200" : ""} ${!isSelected ? "hover:bg-gray-100" : ""} rounded-lg cursor-pointer`}
    >
      <Avatar
        alt={"User"}
        sx={{width: 40, height: 40}}
      >
        <i className={"fa-solid fa-user"}/>
      </Avatar>
      <div className={"w-full flex justify-between gap-3 leading-[1.375rem] ml-2.5 truncate"}>
        <div className={"truncate"}>
          <p className={"truncate"}>
            {chatRoom.name}
          </p>
          <p className={"font-extralight text-sm truncate"}>
            {chatRoom.lastActivity || ""}
          </p>
        </div>
        <p className={"font-extralight text-sm/[1.375rem]"}>
          {formatChatRoomCardDate(chatRoom.lastUsedTime)}
        </p>
      </div>
    </div>
  )
}