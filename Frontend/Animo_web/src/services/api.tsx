import axios from 'axios';
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER_BASE_URL}/api/v1/`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : null,
  },
});

export const chatRoomHubConnection = new HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_API_SERVER_BASE_URL}/ChatRoomHub`)
  .configureLogging(LogLevel.Information)
  .build();

export const chatRoomsListHubConnection = new HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_API_SERVER_BASE_URL}/ChatRoomsListHub`)
  .configureLogging(LogLevel.Information)
  .build();