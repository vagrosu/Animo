import { Pressable, View, StyleSheet, Text, ScrollView } from "react-native";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faEllipsis,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import COLORS from "../../utils/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaStyle } from "../../utils/hooks";
import IconAvatar from "../../components/IconAvatar";
import { MemberType } from "../chatRoom/types";
import MemberListCard from "./MemberListCard";
import { useState } from "react";

type RouteParamsType = {
  name: string;
  members: MemberType[];
  isGroupChat: boolean;
};

export default function ChatRoomInfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const safeAreaStyles = useSafeAreaStyle();
  const [isChatMembersOpen, setIsChatMembersOpen] = useState(false);
  const { name, members, isGroupChat } = route.params as RouteParamsType;

  const onBackPress = () => {
    navigation.goBack();
  };

  const toggleChatMembers = () => {
    setIsChatMembersOpen((prev) => !prev);
  };

  return (
    <View style={safeAreaStyles}>
      <ScrollView style={styles.scrollView} alwaysBounceVertical={false}>
        <View style={styles.headerContainer}>
          <Pressable onPress={onBackPress}>
            <FontAwesomeIcon icon={faChevronLeft} size={19} color={COLORS.blue600} />
          </Pressable>
        </View>
        <View>
          <View style={styles.chatInfoContainer}>
            <IconAvatar icon={isGroupChat ? faUsers : faUser} size={100} />
            <Text style={styles.chatTitle}>{name}</Text>
          </View>
          <View style={styles.chatMembersContainer}>
            <Pressable
              onPress={toggleChatMembers}
              style={({ pressed }) => [styles.chatMembersToggle, pressed && styles.chatMembersTogglePressed]}
            >
              <View style={styles.chatMembersToggleIcon}>
                <FontAwesomeIcon icon={faUsers} size={28} color={COLORS.gray400} />
              </View>
              <View style={styles.chatMembersToggleElements}>
                <Text>Chat members</Text>
                <FontAwesomeIcon icon={isChatMembersOpen ? faChevronDown : faChevronRight} />
              </View>
            </Pressable>
            {isChatMembersOpen && (
              <View>
                {members.map((member) => (
                  <MemberListCard key={member.userId} member={member} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 12,
    paddingHorizontal: 20,
  },

  headerContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  chatInfoContainer: {
    alignItems: "center",
    gap: 12,
  },

  chatTitle: {
    fontSize: 24,
    lineHeight: 32,
  },

  chatMembersContainer: {
    marginTop: 24,
    backgroundColor: COLORS.gray200,
    borderRadius: 8,
    overflow: "hidden",
  },

  chatMembersToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },

  chatMembersTogglePressed: {
    backgroundColor: COLORS.gray300,
  },

  chatMembersToggleIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    aspectRatio: 1,
  },

  chatMembersToggleElements: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
});
