import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChatRoomType } from "../types";
import IconAvatar from "../../../components/IconAvatar";
import { faChevronLeft, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";

type ConversationHeaderProps = {
  chatRoom: ChatRoomType;
};

export default function ConversationHeader({ chatRoom }: ConversationHeaderProps) {
  const navigation = useNavigation();

  const onBackPress = () => {
    navigation.goBack();
  };

  const onInfoPress = () => {
    navigation.navigate("ChatRoomInfo");
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftGroupContainer}>
        <Pressable onPress={onBackPress}>
          <FontAwesomeIcon icon={faChevronLeft} size={19} color={COLORS.blue600} />
        </Pressable>
        <IconAvatar icon={chatRoom.isGroupChat ? faUsers : faUser} style={styles.chatIcon} />
        <Text style={styles.title}>{chatRoom.name}</Text>
      </View>
      <Pressable onPress={onInfoPress}>
        <Ionicons name={"information-circle-outline"} size={24} color={COLORS.blue600} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },

  leftGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  chatIcon: {
    marginLeft: 4,
  },

  title: {
    fontSize: 20,
    lineHeight: 20,
  },
});
