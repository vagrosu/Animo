import {Button, debounce, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import SearchInput from "../../../components/SearchInput.tsx";
import {useEffect, useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import NewChatModalUsersList from "./NewChatModalUsersList.tsx";
import {UserType} from "./types.ts";
import {api} from "../../../services/api.tsx";
import {useUser} from "../../../context/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import {AxiosError} from "axios";
import {ChatRoomResponseType} from "../../../types/api/responses.tsx";
import {ChatRoomsQueryType} from "../../../types/api/queries.tsx";

type NewChatModalProps = {
  isOpen: boolean,
  onClose: () => void,
}

export default function NewChatModal({isOpen, onClose}: NewChatModalProps) {
  const queryClient = useQueryClient();
  const currentUser = useUser();
  const navigate = useNavigate();
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
    createChatMutation.mutate({
      // name: ,
      memberIds: [currentUser.userId, ...selectedUsers.map(user => user.userId)],
    });
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={"sm"}
      fullWidth
    >
      <DialogTitle className={"flex items-center"}>
        New chat
        <i className={"fas fa-times ml-auto cursor-pointer"} onClick={onClose}/>
      </DialogTitle>
      <DialogContent className={""}>
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
      <DialogActions>
        <Button
          onClick={onCreateChat}
        >Create</Button>
      </DialogActions>
    </Dialog>
  )
}