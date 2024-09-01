import { View, StyleSheet, Text, Pressable } from "react-native";
import { UserType } from "./types";
import { faCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import IconAvatar from "../../components/IconAvatar";
import COLORS from "../../utils/colors";

type NewChatUsersListItemProps = {
  user: UserType;
  onSelect: () => void;
  isSelected: boolean;
};

export default function NewChatUsersListItem({ user, onSelect, isSelected }: NewChatUsersListItemProps) {
  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.containerPressed]} onPress={onSelect}>
      <FontAwesomeIcon icon={isSelected ? faCircle : faCircleEmpty} color={COLORS.blue600} />
      <IconAvatar icon={faUser} size={30} style={styles.userAvatar} />
      <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },

  containerPressed: {
    backgroundColor: COLORS.gray200,
  },

  userAvatar: {
    marginLeft: 14,
  },

  name: {
    marginLeft: 8,
  },
});
