import React, { createContext, ReactNode, useContext, useState } from "react";
import { useUser } from "../UserContext";
import SelfieConsentModal from "./SelfieConsentModal";

type SelfieConsentModalContextType = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

const SelfieConsentModalContext = createContext<SelfieConsentModalContextType>({
  isOpen: false,
  toggle: () => {},
  open: () => {},
  close: () => {},
});

export function useSelfieConsentModal() {
  const context = useContext(SelfieConsentModalContext);

  if (context === undefined) {
    throw new Error("useSelfieConsentModal must be used within a SelfieConsentModalProvider");
  }

  return context;
}

export default function SelfieConsentProtectedContextProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const [isSelfieConsentModalOpen, setIsSelfieConsentModalOpen] = useState(false);
  const [allowClose, setAllowClose] = useState(true);

  if (!user.isSelfieConsentAsked && !isSelfieConsentModalOpen) {
    setAllowClose(false);
    setIsSelfieConsentModalOpen(true);
  }

  const toggle = () => {
    setAllowClose(true);
    setIsSelfieConsentModalOpen((prev) => !prev);
  };
  const open = () => {
    setAllowClose(true);
    setIsSelfieConsentModalOpen(true);
  };
  const close = () => {
    setAllowClose(true);
    setIsSelfieConsentModalOpen(false);
  };

  return (
    <SelfieConsentModalContext.Provider
      value={{
        isOpen: isSelfieConsentModalOpen,
        toggle,
        open,
        close,
      }}
    >
      <SelfieConsentModal
        isOpen={isSelfieConsentModalOpen}
        onClose={allowClose ? close : undefined}
        onGiveConsentExtra={close}
      />
      {children}
    </SelfieConsentModalContext.Provider>
  );
}
