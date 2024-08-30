import {Avatar, Checkbox, CircularProgress, Dialog, DialogContent, FormControlLabel} from "@mui/material";
import {AxiosError} from "axios";
import {UsersByUserIdResponseType} from "../../types/api/responses.ts";
import {useQuery} from "react-query";
import {api} from "../../services/api.tsx";
import {useState} from "react";
import SelfieConsentModal from "../../components/SelfieConsentModal/SelfieConsentModal.tsx";
import {useUser} from "../UserContext.tsx";

type UserProfileModalProps = {
  isOpen: boolean,
  toggle: () => void,
  userId: string,
}

export default function UserProfileModal({isOpen, toggle, userId}: UserProfileModalProps) {
  const currentUser = useUser();
  const isCurrentUser = userId === currentUser.userId;
  const [isSelfieConsentModalOpen, setIsSelfieConsentModalOpen] = useState(false);

  const userQuery = useQuery<UsersByUserIdResponseType, AxiosError | Error>({
    queryKey: ["Users", userId, "UserProfileModal"],
    queryFn: async () => api.get<UsersByUserIdResponseType>(`Users/${userId}`)
      .then(res => res.data)
  })

  const selfieConsentModalToggle = () => {
    setIsSelfieConsentModalOpen(!isSelfieConsentModalOpen);
  }

  const onGiveConsentExtra = () => {
    userQuery.refetch()
    setIsSelfieConsentModalOpen(false)
  }

  const user = userQuery.data?.user;
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={toggle}
        fullWidth
        classes={{
          paper: "!rounded-2xl !px-10 !py-8 !max-w-[40rem]"
        }}
      >
        <i
          onClick={toggle}
          className={"fas fa-times text-xl absolute right-5 top-5 cursor-pointer"}
        />
        <DialogContent>
          {!userQuery.isLoading && user ? (
            <div>
              <div className={"flex flex-row items-center"}>
                <Avatar
                  sx={{width: 90, height: 90}}
                >
                  <i className={"fa-solid fa-user text-5xl text-zinc-50"}/>
                </Avatar>
                <div className={"ml-6"}>
                  <h2 className={"font-semibold text-2xl text-gray-600"}>
                    {user.firstName} {user.lastName}
                    {user.username && <label className={"font-light text-xl text-gray-500"}> ({user.username})</label>}
                  </h2>
                  {
                    user.phoneNumber && <div className={"flex items-center gap-2"}>
                      <i className={"fa-solid fa-fw fa-phone text-blue-400"}/>
                      <p className={"font-normal text-gray-500"}>{user.phoneNumber}</p>
                    </div>
                  }
                  {
                    user.email && <div className={"flex items-center gap-2"}>
                      <i className={"fa-solid fa-fw fa-envelope text-blue-400"}/>
                      <p className={"font-normal text-gray-500"}>{user.email}</p>
                    </div>
                  }
                </div>
              </div>
              {isCurrentUser && <>
                <hr className={"my-6"}/>
                <FormControlLabel
                  control={<Checkbox
                    checked={user.isSelfieConsentGiven}
                    onChange={() => setIsSelfieConsentModalOpen(true)}
                  />}
                  label="Consent to use selfies"
                />
              </>}
            </div>
          ) : (
            <div className={"flex py-24"}>
              {userQuery.isError ? (
                <div>Error</div>
              ) : (
                <CircularProgress className={"mx-auto"}/>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isSelfieConsentModalOpen && (
        <SelfieConsentModal
          isOpen={isSelfieConsentModalOpen}
          toggle={selfieConsentModalToggle}
          onGiveConsentExtra={onGiveConsentExtra}
        />
      )}
    </>
  )
}