import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "../../components/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SortByDropdown, { SORT_BY_OPTIONS } from "./components/SortByDropdown";
import COLORS from "../../utils/colors";
import ChatRoomsListHubContextProvider from "../../context/ChatRoomsListHubContext";
import ChatRoomsList from "./ChatRoomsList";
import { useSafeAreaStyle } from "../../utils/hooks";

export default function ChatRoomsListScreen() {
  const navigation = useNavigation();
  const safeAreaStyle = useSafeAreaStyle();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(SORT_BY_OPTIONS.NEWEST);

  const onOpenDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <View style={[styles.container, safeAreaStyle]}>
      <View style={[styles.titleContainer, styles.pageHorizontalPadding]}>
        <Pressable onPress={onOpenDrawer}>
          <FontAwesomeIcon icon={faBars} size={24} style={styles.menuIcon} />
        </Pressable>
        <Text style={styles.title}>Messages</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={[styles.filtersContainer, styles.pageHorizontalPadding]}>
          <SearchInput value={search} onChangeText={setSearch} />
          <SortByDropdown value={sortBy} onChange={setSortBy} />
        </View>
        <ChatRoomsListHubContextProvider>
          <ChatRoomsList search={search} sortBy={sortBy} />
        </ChatRoomsListHubContextProvider>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pageHorizontalPadding: {
    paddingHorizontal: 16,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 16,
  },

  menuIcon: {
    color: COLORS.blue600,
  },

  scrollViewContentContainer: {
    flexGrow: 1,
  },

  title: {
    lineHeight: 32,
    fontWeight: "700",
    fontSize: 30,
  },

  filtersContainer: {
    paddingHorizontal: 8,
    marginTop: 20,
    gap: 10,
  },
});
