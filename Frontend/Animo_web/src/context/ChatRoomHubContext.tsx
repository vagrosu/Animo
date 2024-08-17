import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {HubConnection} from "@microsoft/signalr";
import {chatRoomHubConnection} from "../services/api.tsx";

type ChatRoomHubContextType = {
  connection: HubConnection | null,
  isConnected: boolean,
}

const ChatRoomHubContext = createContext<ChatRoomHubContextType>({
  connection: chatRoomHubConnection,
  isConnected: false,
});

export const useChatRoomHub = () => {
  const context = useContext(ChatRoomHubContext);
  if (context === undefined) {
    throw new Error("useChatRoomHub must be used within a ChatRoomHubContextProvider");
  }
  return context;
}

export default function ChatRoomHubContextProvider({children}: {children: ReactNode}) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setConnection(chatRoomHubConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      if(connection.state === "Connected") {
        setIsConnected(true);
        return;
      }

      connection.start()
        .then(() => {
          setIsConnected(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [connection]);

  return (
    <ChatRoomHubContext.Provider value={{connection, isConnected}}>
      {children}
    </ChatRoomHubContext.Provider>
  )
}