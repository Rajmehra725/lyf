import axios from "axios";

const API = axios.create({
  baseURL: "https://raaznotes-backend.onrender.com/api/chat",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMessages = (userId) => API.get(`/${userId}`);
export const sendMessage = (formData) => API.post("/send", formData);
export const markAsSeen = (conversationId) => API.put(`/seen/${conversationId}`);
export const reactToMessage = (messageId, emoji) => API.put(`/react/${messageId}`, { emoji });
export const deleteMessage = (messageId, forEveryone = false) => API.delete(`/delete/${messageId}`, { data: { forEveryone } });
