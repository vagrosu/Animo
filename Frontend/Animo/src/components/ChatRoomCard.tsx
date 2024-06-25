import {ChatRoomCardType} from "../pages/chats/types.ts";
import {Avatar, Tooltip} from "@mui/material";
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
  isChatRoomListExpanded: boolean,
  isSelected: boolean,
  chatRoom: ChatRoomCardType,
  onSelectChatRoom: () => void,
}

export default function ChatRoomCard({isChatRoomListExpanded, isSelected, chatRoom, onSelectChatRoom}: ChatRoomCardProps) {
  const avatarSize = isChatRoomListExpanded ? 40 : 32;

  return (
    <div
      onClick={onSelectChatRoom}
      className={`flex items-center mt-0.5 ${isChatRoomListExpanded ? "px-3.5" : "px-3"} py-2.5 ${isSelected ? "bg-gray-200" : ""} ${!isSelected ? "hover:bg-gray-100" : ""} rounded-lg cursor-pointer`}
    >
      <Tooltip
        title={chatRoom.name}
        placement={"right"}
        slotProps={{
          tooltip: {
            className: isChatRoomListExpanded ? "hidden" : ""
          }
        }}
        arrow
      >
        <Avatar
          alt={"User"}
          sx={{width: avatarSize, height: avatarSize}}
        >
          <i className={`fa-solid fa-${chatRoom.isGroupChat ? "users" : "user"} ${isChatRoomListExpanded ? "text-xl" : "text-base"}`}/>
        </Avatar>
      </Tooltip>
      {isChatRoomListExpanded && <div className={"w-full flex justify-between gap-3 leading-[1.375rem] ml-2.5 truncate"}>
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
      </div>}
    </div>
  )
}