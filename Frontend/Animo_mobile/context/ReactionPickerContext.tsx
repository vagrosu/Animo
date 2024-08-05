import { createContext, useContext, useState } from "react";

type ReactionPickerContextType = {
  selectedMessageId: string | null;
  setSelectedMessageId: (messageId: string | null) => void;
};

const ReactionPickerContext = createContext<ReactionPickerContextType>({
  selectedMessageId: null,
  setSelectedMessageId: () => {},
});

export const useReactionPicker = () => {
  const context = useContext(ReactionPickerContext);

  if (context === undefined) {
    throw new Error("useReactionPicker must be used within a ReactionPickerContextProvider");
  }

  return context;
};

export default function ReactionPickerContextProvider({ children }: { children: React.ReactNode }) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  return (
    <ReactionPickerContext.Provider value={{ selectedMessageId, setSelectedMessageId }}>
      {children}
    </ReactionPickerContext.Provider>
  );
}
