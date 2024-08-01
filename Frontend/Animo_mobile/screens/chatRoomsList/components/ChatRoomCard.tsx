import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ChatRoomCardType } from "../types";
import IconAvatar from "../../../components/IconAvatar";
import { differenceInDays, differenceInMonths, differenceInYears, format, isToday, isYesterday, parseISO } from "date-fns";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import COLORS from "../../../utils/colors";

const formatChatRoomCardDate = (date: string) => {
  const dateIso = parseISO(date);
  const today = new Date();

  if (isToday(dateIso)) {
    return format(dateIso, "HH:mm");
  } else if (isYesterday(dateIso)) {
    return "Yesterday";
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
};

type ChatRoomCardProps = {
  chatRoom: ChatRoomCardType;
  onSelectChatRoom: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ChatRoomCard({ chatRoom, onSelectChatRoom, style }: ChatRoomCardProps) {
  return (
    <Pressable onPress={onSelectChatRoom} style={({ pressed }) => [styles.container, style, pressed && styles.containerPressed]}>
      <IconAvatar icon={chatRoom.isGroupChat ? faUsers : faUser} />
      <View style={styles.chatRoomInfoContainer}>
        <View style={styles.leftColContainer}>
          <Text style={styles.nameText}>{chatRoom.name}</Text>
          <Text style={styles.lastActivityText} numberOfLines={1}>
            {chatRoom.lastActivity || ""}
          </Text>
        </View>
        <Text style={styles.lastUsedText}>{formatChatRoomCardDate(chatRoom.lastUsedTime)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  containerPressed: {
    backgroundColor: COLORS.gray200,
  },

  chatRoomInfoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
    gap: 24,
  },

  leftColContainer: {
    flex: 1,
  },

  nameText: {
    fontSize: 16,
  },

  lastActivityText: {
    fontWeight: "200",
    lineHeight: 20,
  },

  lastUsedText: {
    fontWeight: "200",
    lineHeight: 22,
  },
});
