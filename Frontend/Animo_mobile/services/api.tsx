import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createApiInstance = async () => {
  const token = await AsyncStorage.getItem("token");

  return axios.create({
    baseURL: "http://localhost:5167/api/v1/",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : null,
    },
  });
};
