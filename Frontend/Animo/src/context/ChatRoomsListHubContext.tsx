import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { chatRoomsListHubConnection } from "../services/api.tsx";
import { HubConnection } from "@microsoft/signalr";
import { useUser } from "./UserContext.tsx";

type ChatRoomsListHubContextType = {
  connection: HubConnection | null,
  isConnected: boolean,
}

const ChatRoomsListHubContext = createContext<ChatRoomsListHubContextType>({
  connection: null,
  isConnected: false,
});

export const useChatRoomsListHub = () => {
  const context = useContext(ChatRoomsListHubContext);
  if (context === undefined) {
    throw new Error("useChatRoomsListHub must be used within a ChatRoomsListHubContextProvider");
  }
  return context;
}

export default function ChatRoomsListHubContextProvider({ children }: { children: ReactNode }) {
  const { userId } = useUser();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setConnection(chatRoomsListHubConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          connection.invoke("JoinChatRoomsList", userId);
          setIsConnected(true);
        })
        .catch((error) => {
          console.error("Error starting connection", error);
        });
    }
  }, [connection, userId]);

  return (
    <ChatRoomsListHubContext.Provider value={{ connection, isConnected }}>
      {children}
    </ChatRoomsListHubContext.Provider>
  )
}
