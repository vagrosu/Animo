import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const createApiInstance = async () => {
  const token = await AsyncStorage.getItem("token");

  return axios.create({
    baseURL: `${process.env.API_SERVER_BASE_URL}/api/v1/`,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : null,
    },
  });
};

export const chatRoomHubConnection = new HubConnectionBuilder()
  .withUrl(`${process.env.API_SERVER_BASE_URL}/ChatRoomHub`)
  .configureLogging(LogLevel.Information)
  .build();

export const chatRoomsListHubConnection = new HubConnectionBuilder()
  .withUrl(`${process.env.API_SERVER_BASE_URL}/ChatRoomsListHub`)
  .configureLogging(LogLevel.Information)
  .build();
