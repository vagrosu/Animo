import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const createApiInstance = async () => {
  const token = await AsyncStorage.getItem("token");

  return axios.create({
    baseURL: "http://localhost:5167/api/v1/",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : null,
    },
  });
};

export const chatRoomHubConnection = new HubConnectionBuilder()
  .withUrl("http://localhost:5167/ChatRoomHub")
  .configureLogging(LogLevel.Information)
  .build();

export const chatRoomsListHubConnection = new HubConnectionBuilder()
  .withUrl("http://localhost:5167/ChatRoomsListHub")
  .configureLogging(LogLevel.Information)
  .build();
