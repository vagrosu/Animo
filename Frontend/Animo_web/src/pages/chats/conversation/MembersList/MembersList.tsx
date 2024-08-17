import {MemberType} from "../../types.ts";
import {Avatar} from "@mui/material";
import {useState} from "react";
import MembersListCard from "./MembersListCard.tsx";
import useWindowDimensions from "../../../../utils/hooks.ts";
import {OPENED_CHAT_ROOM_MEMBERS_LIST_MIN_WIDTH} from "../ConversationContainer.tsx";

type MembersListProps = {
  name: string,
  members: MemberType[],
  isGroupChat: boolean,
  toggleMembersList: () => void,
}

export default function MembersList({name, members, isGroupChat, toggleMembersList}: MembersListProps) {
  const isFloating = useWindowDimensions().width < OPENED_CHAT_ROOM_MEMBERS_LIST_MIN_WIDTH;
  const [isMembersListOpened, setIsMembersListOpened] = useState(true);

  return (
    <div className={`${isFloating ? "absolute right-0 z-50" : "relative"} flex flex-col items-center py-20 px-5 overflow-y-scroll bg-white min-w-[17.5rem] w-[24vw] max-w-[23rem] h-full border-l border-gray-200`}>
      {isFloating && (
        <div
          className={"absolute flex items-center justify-center top-0 left-3 h-[4.25rem]"}
          onClick={toggleMembersList}
        >
          <i className={"fa-solid fa-xmark text-2xl text-blue-600 cursor-pointer p-2 mt-[-0.125rem]"}/>
        </div>

      )}
      <div className={"flex flex-col items-center justify-center gap-3"}>
        <Avatar
          alt={"User"}
          sx={{width: 75, height: 75}}
        >
          <i className={`fa-solid fa-${isGroupChat ? "users" : "user"} text-4xl`}/>
        </Avatar>
        <p className={"text-2xl"}>{name}</p>
      </div>
      <div className={"w-full flex flex-col self-start mt-7"}>
        <div
          className={"w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 cursor-pointer select-none"}
          onClick={() => setIsMembersListOpened(!isMembersListOpened)}
        >
          <p>Chat members</p>
          <i className={`fa-solid fa-chevron-${isMembersListOpened ? "down" : "right"}`}/>
        </div>
        <div className={"flex flex-col gap-2.5 mt-4 mx-2"}>
          {isMembersListOpened && members.map((member) => (
            <MembersListCard
              key={member.userId}
              member={member}
            />
          ))}
        </div>
      </div>
    </div>
  )
}