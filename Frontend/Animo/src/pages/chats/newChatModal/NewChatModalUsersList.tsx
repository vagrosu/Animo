import {useQuery} from "react-query";
import {api} from "../../../services/api.tsx";
import {UsersBySearchResponseType} from "../../../types/api/responses.tsx";
import {AxiosError} from "axios";
import {UserType} from "./types.ts";
import NewChatModalUsersListItem from "./NewChatModalUsersListItem.tsx";
import {useUser} from "../../../context/UserContext.tsx";

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
    .filter(user => !selectedUsers.some(selectedUser => {
      return selectedUser.userId === user.userId && currentUser.userId !== user.userId
    })) || [];

  const onSelectUser = (user: UserType) => {
    if (selectedUsers.find(selectedUser => selectedUser.userId === user.userId)) {
      setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.userId !== user.userId));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  }

  return (
    <div className={"mt-3 w-full"}>
      {selectedUsers.map(user => (
        <NewChatModalUsersListItem
          key={user.userId}
          user={user}
          onSelect={() => onSelectUser(user)}
          isSelected={true}
        />
      ))}
      <div></div>
      {usersSearchQuery.isLoading ? (
        <div>Loading...</div>
      ) : usersSearchQuery.isError ? (
        <div>Error</div>
      ) : !unselectedUsers.length && search ? (
        <div>No users found</div>
      ) : unselectedUsers.map(user => (
        <NewChatModalUsersListItem
          key={user.userId}
          user={user}
          onSelect={() => onSelectUser(user)}
          isSelected={false}
        />
      ))}
    </div>
  );
}