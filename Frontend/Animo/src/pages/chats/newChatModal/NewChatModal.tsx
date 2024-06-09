import {Button, debounce, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField} from "@mui/material";
import SearchInput from "../../../components/SearchInput.tsx";
import {useEffect, useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import NewChatModalUsersList from "./NewChatModalUsersList.tsx";
import {UserType} from "./types.ts";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import {AxiosError} from "axios";
import {ChatRoomResponseType} from "../../../types/api/responses.ts";
import {ChatRoomsQueryType} from "../../../types/api/queries.ts";
import {LoadingButton} from "@mui/lab";
import {toast} from "react-toastify";
import {getErrorMessage} from "../../../utils/helpers.ts";

type NewChatModalProps = {
  isOpen: boolean,
  onClose: () => void,
}

export default function NewChatModal({isOpen, onClose}: NewChatModalProps) {
  const queryClient = useQueryClient();
  const currentUser = useUser();
  const navigate = useNavigate();
  const [chatName, setChatName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  const createChatMutation = useMutation<ChatRoomResponseType, Error | AxiosError, ChatRoomsQueryType>({
    mutationFn: async (data) => api.post("ChatRooms", {
      name: data.name,
      memberIds: data.memberIds,
    }),
    onSuccess: (res) => {
      if (res.data?.chatRoom?.chatRoomId) {
        navigate(`/chats/${res.data.chatRoom.chatRoomId}`)
      }
      onClose();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  })

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (search.replaceAll(" ", "").length > 0) {
        queryClient.refetchQueries(["Users", "by-search", search, "NewChatModalUsersList"]);
      }
    }, 500);

    debouncedSearch();

    return () => {
      debouncedSearch.clear();
    }
  }, [search]);

  const onCreateChat = () => {
    const memberIds = [currentUser.userId, ...selectedUsers.map(user => user.userId)];

    if (memberIds.length < 2) {
      toast.error("Select at least one user");
      return;
    }

    createChatMutation.mutate({
      ...(chatName.trim() && {name: chatName.trim()}),
      memberIds: [currentUser.userId, ...selectedUsers.map(user => user.userId)],
    });
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={"sm"}
      fullWidth
      classes={{
        paper: "!rounded-2xl !px-6 !py-4"
      }}
    >
      <DialogTitle className={"flex items-center !px-0 !pt-0"}>
        Create chat
        <i
          onClick={onClose}
          className={"fas fa-times text-xl absolute right-5 top-5 cursor-pointer"}
        />
      </DialogTitle>
      <DialogContent className={"!p-0"}>
        <TextField
          variant={"standard"}
          value={chatName}
          onChange={e => setChatName(e.target.value)}
          placeholder={"Chat name"}
          fullWidth
          className={"!mb-4 !px-1.5"}
          disabled={selectedUsers.length < 2}
        />
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={"Search for people to chat with..."}
        />
        <NewChatModalUsersList
          search={search}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      </DialogContent>
      <DialogActions className={"!px-0 !pb-0"}>
        <LoadingButton
          variant={"contained"}
          className={"!rounded-lg !py-2.5 !px-5 !bg-blue-600 text-white !normal-case !shadow-none hover:!bg-blue-700"}
          loading={createChatMutation.isLoading}
          onClick={onCreateChat}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}