import axios from 'axios';

const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: 'http://localhost:5167/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : null,
  },
});
