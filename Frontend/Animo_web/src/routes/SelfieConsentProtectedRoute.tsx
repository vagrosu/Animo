import {Outlet} from "react-router-dom";
import {useUser} from "../context/UserContext.tsx";
import SelfieConsentModal from "../components/SelfieConsentModal/SelfieConsentModal.tsx";
import {toast} from "react-toastify";

export default function SelfieConsentProtectedRoute() {
  const user = useUser()

  if (!user.isSelfieConsentAsked) {
    return <>
      <SelfieConsentModal
        isOpen={true}
        onGiveConsentExtra={(isConsentGiven) => {
          if (isConsentGiven) {
            try {
              navigator.mediaDevices.getUserMedia({video: true});
            } catch (err) {
              toast.error("Failed to access camera. Please check your camera settings.")
            }
          }
        }}
      />
      <Outlet/>
    </>;
  }


  return <Outlet/>
}