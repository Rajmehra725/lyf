// src/api/axiosInstance.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://raaznotes-backend.onrender.com/api", // 🔹 Replace with your backend URL
  withCredentials: true,
});

// 🔐 Add token from localStorage to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
