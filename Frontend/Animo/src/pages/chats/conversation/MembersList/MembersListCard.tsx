import {Avatar} from "@mui/material";
import {MemberType} from "../../types.ts";
import {useUserProfileModal} from "../../../../context/UserProfileModalContext/UserProfileModalContext.tsx";

export default function MembersListCard({member}: {member: MemberType}) {
  const userProfileModal = useUserProfileModal();

  const onMemberClick = () => {
    userProfileModal.open(member.userId);
  }

  return (
    <div key={member.userId} className={"flex items-center gap-2 ml-1.5 mr-2.5"}>
      <Avatar
        alt={"User"}
        sx={{width: 32, height: 32}}
      >
        <i className={"fa-solid fa-user text-base"}/>
      </Avatar>
      <p>{member.firstName} {member.lastName}</p>
      <i
        className={"fa-solid fa-ellipsis ml-auto cursor-pointer p-1.5 -m-1.5 rounded-full hover:bg-gray-200"}
        onClick={onMemberClick}
      />
    </div>
  )
}