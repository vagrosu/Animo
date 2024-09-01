import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useQuery } from "react-query";
import { UsersBySearchResponseType } from "../../types/api/responses";
import { AxiosError } from "axios";
import { createApiInstance } from "../../services/api";
import { UserType } from "./types";
import { useUser } from "../../context/UserContext";
import { getErrorMessage } from "../../utils/helpers";
import { faCircleExclamation, faUsers, faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../utils/colors";
import NoContent from "../../components/NoContent";
import NewChatUsersListItem from "./NewChatUsersListItem";

type NewChatUsersListProps = {
  search: string;
  selectedUsers: UserType[];
  setSelectedUsers: (users: UserType[]) => void;
};

export default function NewChatUsersList({ search, selectedUsers, setSelectedUsers }: NewChatUsersListProps) {
  const currentUser = useUser();

  const usersSearchQuery = useQuery<UsersBySearchResponseType, AxiosError | Error>({
    queryKey: ["Users", "by-search", search, "NewChatModalUsersList"],
    queryFn: async () => {
      const api = await createApiInstance();
      return api.get(`Users/by-search?search=${search}`).then((res) => res.data);
    },
    enabled: false,
  });

  const unselectedUsers =
    usersSearchQuery.data?.users.filter(
      (user) =>
        user.userId !== currentUser.userId &&
        !selectedUsers.some((selectedUser) => {
          return selectedUser.userId === user.userId;
        })
    ) || [];

  const noUsersFound = !!(search && !usersSearchQuery.data?.users.find((user) => user.userId !== currentUser.userId));
  const isLoading = search && (usersSearchQuery.isLoading || usersSearchQuery.isIdle);

  const onSelectUser = (user: UserType) => {
    if (selectedUsers.find((selectedUser) => selectedUser.userId === user.userId)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.userId !== user.userId));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <View style={styles.container}>
      {search || selectedUsers.length ? (
        <ScrollView contentContainerStyle={styles.contentContainer} alwaysBounceVertical={false}>
          {selectedUsers.map((user) => (
            <NewChatUsersListItem key={user.userId} user={user} onSelect={() => onSelectUser(user)} isSelected={true} />
          ))}
          {isLoading ? (
            <ActivityIndicator style={styles.placeholder} />
          ) : usersSearchQuery.isError ? (
            <NoContent
              subtitle={getErrorMessage(usersSearchQuery.error)}
              title={"Something went wrong"}
              icon={faCircleExclamation}
              iconColor={COLORS.red600}
              style={styles.placeholder}
            />
          ) : noUsersFound ? (
            <NoContent
              subtitle={"No users match your search"}
              icon={faUsersSlash}
              iconColor={COLORS.gray600}
              style={styles.placeholder}
            />
          ) : (
            unselectedUsers.map((user) => (
              <NewChatUsersListItem key={user.userId} user={user} onSelect={() => onSelectUser(user)} isSelected={false} />
            ))
          )}
        </ScrollView>
      ) : (
        <NoContent
          subtitle={"Add users to your chat"}
          icon={faUsers}
          iconColor={COLORS.gray600}
          style={styles.placeholder}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
    marginVertical: 16,
  },

  placeholder: {
    marginVertical: "auto",
  },
});
