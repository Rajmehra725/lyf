// axios helper
import axios from "axios";

const BASE = "https://raaznotes-backend.onrender.com/api";

const api = axios.create({
  baseURL: BASE,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
