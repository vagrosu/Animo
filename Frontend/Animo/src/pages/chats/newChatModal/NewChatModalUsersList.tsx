import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {UsersBySearchResponseType} from "../../../types/api/responses.ts";
import {AxiosError} from "axios";
import {UserType} from "./types.ts";
import NewChatModalUsersListItem from "./NewChatModalUsersListItem.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import {Skeleton} from "@mui/material";

function Loading() {
  return (
    <div className={"min-h-[2.875rem] max-h-[2.875rem] overflow-hidden rounded-lg"}>
      <Skeleton
        className={"!mt-[-50rem]"}
        height={"100rem"}
      />
    </div>
  )
}

function Placeholder() {
  return (
    <div className={"my-auto flex flex-col items-center justify-center gap-4"}>
      <i className={"fas fa-regular fa-users text-5xl text-gray-500"}/>
      <p className={"text-gray-500"}>Add users to your chat</p>
    </div>
  )
}

function NoUsers() {
  return (
    <div className={"my-auto pt-4 flex flex-col items-center justify-center gap-4"}>
      <i className={"fas fa-regular fa-users-slash text-5xl text-gray-500"}/>
      <p className={"text-gray-500"}>No users match your search</p>
    </div>
  )
}

type NewChatModalUsersListProps = {
  search: string,
  selectedUsers: UserType[],
  setSelectedUsers: (val: UserType[]) => void,
};

export default function NewChatModalUsersList({search, selectedUsers, setSelectedUsers}: NewChatModalUsersListProps) {
  const currentUser = useUser();

  const usersSearchQuery = useQuery<UsersBySearchResponseType, AxiosError | Error>({
    queryKey: ["Users", "by-search", search, "NewChatModalUsersList"],
    queryFn: async () => api.get(`Users/by-search?search=${search}`)
      .then(res => res.data),
    enabled: false
  });

  const unselectedUsers = usersSearchQuery.data?.users
    .filter(user => user.userId !== currentUser.userId && !selectedUsers.some(selectedUser => {
      return selectedUser.userId === user.userId
    })) || [];

  const noUsersFound = !!(search && !usersSearchQuery.data?.users.find(user => user.userId !== currentUser.userId));
  const isLoading = search && (usersSearchQuery.isLoading || usersSearchQuery.isIdle);

  const onSelectUser = (user: UserType) => {
    if (selectedUsers.find(selectedUser => selectedUser.userId === user.userId)) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.userId !== user.userId));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  }

  return (
    <div className={"flex flex-col mt-3 w-full min-h-48"}>
      {search || selectedUsers.length ? (
        <>
          {selectedUsers.map(user => (
            <NewChatModalUsersListItem
              key={user.userId}
              user={user}
              onSelect={() => onSelectUser(user)}
              isSelected={true}
            />
          ))}
          {isLoading ? (
            <Loading />
          ) : usersSearchQuery.isError ? (
            <div>Error</div>
          ) : noUsersFound ? (
            <NoUsers />
          ) : unselectedUsers.map(user => (
            <NewChatModalUsersListItem
              key={user.userId}
              user={user}
              onSelect={() => onSelectUser(user)}
              isSelected={false}
            />
          ))}
        </>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}