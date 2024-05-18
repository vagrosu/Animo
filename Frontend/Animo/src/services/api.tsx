import axios from 'axios';
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: 'http://localhost:5167/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : null,
  },
});

export const chatRoomHubConnection = new HubConnectionBuilder()
  .withUrl("http://localhost:5167/ChatRoomHub")
  .configureLogging(LogLevel.Information)
  .build();
