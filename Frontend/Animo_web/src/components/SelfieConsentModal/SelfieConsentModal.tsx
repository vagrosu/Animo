import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useUser} from "../../context/UserContext.tsx";
import {useMutation} from "react-query";
import {UsersUpdateSelfieConsentResponseType} from "../../types/api/responses.ts";
import {AxiosError} from "axios";
import {UsersUpdateSelfieConsentQueryType} from "../../types/api/queries.ts";
import {api} from "../../services/api.tsx";
import {LoadingButton} from "@mui/lab";

type SelfieConsentModalProps = {
  isOpen: boolean,
  toggle?: () => void,
  onGiveConsentExtra?: (isConsentGiven: boolean) => void
}

export default function SelfieConsentModal({isOpen, toggle, onGiveConsentExtra}: SelfieConsentModalProps) {
  const user = useUser()

  const giveConsentMutation = useMutation<UsersUpdateSelfieConsentResponseType, Error | AxiosError, UsersUpdateSelfieConsentQueryType>({
    mutationFn: async (data) => api.patch(`Users/update-selfie-consent`, {
      userId: data.userId,
      isSelfieConsentGiven: data.isSelfieConsentGiven
    }),
    onSettled: () => {
      user.refetch();
    }
  })

  const onGiveConsent = async (isConsentGiven: boolean) => {
    await giveConsentMutation.mutateAsync({
      userId: user.userId,
      isSelfieConsentGiven: isConsentGiven
    })

    onGiveConsentExtra && onGiveConsentExtra(isConsentGiven);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      fullWidth
      className={"bg-black/60"}
      classes={{
        paper: "!rounded-2xl !px-10 !py-8 !max-w-[55rem]"
      }}
    >
      <DialogTitle className={"!p-0 !text-2xl"}>
        Consent to use your selfies
        {toggle && <i
          onClick={toggle}
          className={"fas fa-times text-xl absolute right-5 top-5 cursor-pointer"}
        />}
      </DialogTitle>
      <DialogContent className={"!p-0 mt-4 text-gray-500"}>
        <p>Your privacy is important. We request permission to use your camera to capture selfies for emotion
          analysis.</p>
        <br/>
        <p>Here’s what you should know:</p>
        <ul style={{listStyleType: 'disc', marginLeft: '20px'}}>
          <li><strong>Security:</strong> We don't store your images, they are automatically deleted after analysis.
          </li>
          <li><strong>Encryption:</strong> All data is securely encrypted during transmission.</li>
          <li><strong>Processing:</strong> All emotion analysis is conducted on our secure server, not on your device.
          </li>
          <li><strong>Control:</strong> You can withdraw consent at any time from your profile settings.</li>
          <li><strong>Usage:</strong> The camera is used only when you send a message.</li>
        </ul>
        <br/>
        <p>By agreeing, you allow us to access your camera and process your selfie under these conditions.</p>
      </DialogContent>
      <DialogActions className={"!p-0 mt-7 gap-3"}>
        <LoadingButton
          className={`w-44 !rounded-lg !py-2.5 !border-blue-600 ${!giveConsentMutation.isLoading ? "!text-blue-600" : ""} !normal-case`}
          variant={"outlined"}
          loading={giveConsentMutation.isLoading}
          onClick={() => onGiveConsent(false)}
        >
          Disagree
        </LoadingButton>
        <LoadingButton
          variant={"contained"}
          className={"w-44 !rounded-lg !py-2.5 !bg-blue-600 text-white !normal-case !shadow-none hover:!bg-blue-700"}
          loading={giveConsentMutation.isLoading}
          onClick={() => onGiveConsent(true)}
        >
          Agree
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}