import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView } from "react-native";
import { useSafeAreaStyle } from "../../utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../utils/colors";
import SearchInput from "../../components/SearchInput";
import { useMutation, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { UserType } from "./types";
import { debounce, getErrorMessage } from "../../utils/helpers";
import NewChatUsersList from "./NewChatUsersList";
import Toast from "react-native-toast-message";
import { useUser } from "../../context/UserContext";
import { CreateChatRoomResponseType } from "../../types/api/responses";
import { AxiosError } from "axios";
import { CreateChatRoomsQueryType } from "../../types/api/queries";
import { createApiInstance } from "../../services/api";
import NewChatNameModal from "./NewChatNameModal";

export default function NewChatScreen() {
  const currentUser = useUser();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const safeAreaStyle = useSafeAreaStyle(styles.container);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [isChatNameModalOpen, setIsChatNameModalOpen] = useState(false);
  const memberIds = [currentUser.userId, ...selectedUsers.map((user) => user.userId)];

  const createChatMutation = useMutation<CreateChatRoomResponseType, Error | AxiosError, CreateChatRoomsQueryType>({
    mutationFn: async (data) => {
      const api = await createApiInstance();
      return api.post("ChatRooms", {
        name: data.name,
        memberIds: data.memberIds,
      });
    },
    onSuccess: (res) => {
      onCloseChatNameModal();
      if (res.data?.chatRoom?.chatRoomId) {
        navigation.navigate("ChatRoom", { chatRoomId: res.data.chatRoom.chatRoomId });
      } else {
        Toast.show({
          type: "error",
          text1: "No chat room id found",
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error),
      });
    },
  });

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (search.replaceAll(" ", "").length > 0) {
        queryClient.refetchQueries(["Users", "by-search", search, "NewChatModalUsersList"]);
      }
    }, 500);

    debouncedSearch();

    return () => {
      debouncedSearch.clear();
    };
  }, [search]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onCloseChatNameModal = () => {
    setIsChatNameModalOpen(false);
  };

  const onCreateChat = (name?: string) => {
    createChatMutation.mutate({
      ...(name && name.trim() && { name: name.trim() }),
      memberIds: memberIds,
    });
  };

  const onNextStep = () => {
    if (memberIds.length < 2) {
      Toast.show({
        type: "error",
        text1: "Select at least one user",
      });
      return;
    }

    if (memberIds.length === 2) {
      onCreateChat();
    } else {
      setIsChatNameModalOpen(true);
    }
  };

  return (
    <>
      <KeyboardAvoidingView style={safeAreaStyle} behavior={"height"}>
        <View style={styles.headerContainer}>
          <View style={styles.backButtonContainer}>
            <Pressable onPress={onBackPress} style={styles.backButton}>
              <FontAwesomeIcon icon={faChevronLeft} size={19} color={COLORS.blue600} />
            </Pressable>
          </View>
          <Text style={styles.title}>Create chat</Text>
        </View>
        <View style={styles.contentContainer}>
          <SearchInput value={search} onChangeText={setSearch} placeholder={"Search for people to chat with..."} />
          <NewChatUsersList search={search} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              memberIds.length < 2 && styles.createButtonDisabled,
              pressed && styles.createButtonPressed,
            ]}
            disabled={memberIds.length < 2}
            onPress={onNextStep}
          >
            <Text style={styles.createButtonContent}>{memberIds.length <= 2 ? "Create" : "Next"}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <NewChatNameModal isOpen={isChatNameModalOpen} onClose={onCloseChatNameModal} onCreateChat={onCreateChat} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 12,
    paddingHorizontal: 20,
  },

  headerContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  backButtonContainer: {
    width: 0,
  },

  backButton: {
    width: 19,
  },

  title: {
    marginHorizontal: "auto",
    lineHeight: 32,
    fontWeight: "700",
    fontSize: 26,
  },

  contentContainer: {
    flex: 1,
    marginTop: 16,
  },

  createButton: {
    marginTop: "auto",
    backgroundColor: COLORS.blue600,
    borderColor: COLORS.blue600,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  createButtonDisabled: {
    backgroundColor: COLORS.gray400,
    borderColor: COLORS.gray400,
  },

  createButtonPressed: {
    backgroundColor: COLORS.blue700,
    borderColor: COLORS.blue700,
  },

  createButtonContent: {
    color: COLORS.white,
    textAlign: "center",
  },
});
