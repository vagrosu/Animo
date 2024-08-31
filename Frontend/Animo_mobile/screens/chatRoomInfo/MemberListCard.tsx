import { View, Text, StyleSheet, Pressable } from "react-native";
import { MemberType } from "../chatRoom/types";
import IconAvatar from "../../components/IconAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis, faUser } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../utils/colors";
import { useShowUserProfileWithActionSheet } from "../../utils/hooks";

type MemberListCardProps = {
  member: MemberType;
};

export default function MemberListCard({ member }: MemberListCardProps) {
  const showUserProfileWithActionSheet = useShowUserProfileWithActionSheet();

  const onMemberCardPress = (member: MemberType) => {
    showUserProfileWithActionSheet(member);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={() => onMemberCardPress(member)}
    >
      <IconAvatar icon={faUser} size={32} />
      <View style={styles.topSeparator}>
        <Text>
          {member.firstName} {member.lastName}
        </Text>
        <FontAwesomeIcon icon={faEllipsis} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
  },

  containerPressed: {
    backgroundColor: COLORS.gray300,
  },

  topSeparator: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingRight: 12,
    marginLeft: 8,
    borderTopWidth: 0.25,
    borderTopColor: COLORS.gray400,
  },
});
