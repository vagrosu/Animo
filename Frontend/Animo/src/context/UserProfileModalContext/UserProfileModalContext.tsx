import {createContext, useContext, useState} from "react";
import UserProfileModal from "./UserProfileModal.tsx";
import {Outlet} from "react-router-dom";

type UserProfileModalContextType = {
  isOpen: boolean,
  open: (val: string) => void,
  close: () => void,
}

const UserProfileModalContext = createContext<UserProfileModalContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export const useUserProfileModal = () => {
  const context = useContext(UserProfileModalContext);
  if (context === undefined) {
    throw new Error("useUserProfileModal must be used within a UserProfileModalContextProvider")
  }

  return context;
}

export default function UserProfileModalContextProvider() {
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const toggle = () => {
    setIsUserProfileModalOpen(!isUserProfileModalOpen)
  }

  const open = (userId: string) => {
    setIsUserProfileModalOpen(true)
    setUserId(userId);
  }

  const close = () => {
    setIsUserProfileModalOpen(false)
    setUserId(null);
  }

  const contextValue: UserProfileModalContextType = {
    isOpen: isUserProfileModalOpen,
    open: open,
    close: close
  }

  return (
    <UserProfileModalContext.Provider value={contextValue}>
      <Outlet />
      {isUserProfileModalOpen && userId && (
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          toggle={toggle}
          userId={userId}
        />
      )}
    </UserProfileModalContext.Provider>
  )
}