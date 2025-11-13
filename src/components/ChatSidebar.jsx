import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, CircularProgress, Badge } from "@mui/material";
import io from "socket.io-client";
import { motion } from "framer-motion";
import axios from "axios";

// 🔹 Socket server
const socket = io("https://raaznotes-backend.onrender.com");

const ChatSidebar = ({ currentUser, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch users along with last message
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get(
          "https://raaznotes-backend.onrender.com/api/users/withLastMessage",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Sort users by lastMessage.createdAt descending
        const sorted = res.data.sort((a, b) => {
          const tA = a.lastMessage?.createdAt || 0;
          const tB = b.lastMessage?.createdAt || 0;
          return new Date(tB) - new Date(tA);
        });
        setUsers(sorted);
      } catch (err) {
        console.error("Fetch users error:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // Socket for online users
  useEffect(() => {
    if (!currentUser?._id) return;
    socket.emit("join", currentUser._id);

    socket.on("onlineUsers", (list) => setActiveUsers(list));

    return () => socket.off("onlineUsers");
  }, [currentUser]);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 5 }} />;

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 300 },
        borderRight: "1px solid #eee",
        height: "100vh",
        overflowY: "auto",
        bgcolor: "#fafafa",
        px: { xs: 1, sm: 0 },
      }}
    >
      <Typography variant="h6" sx={{ p: 2, color: "#333" }}>
        Messages
      </Typography>

      {users
        .filter((user) => user._id !== currentUser?._id)
        .map((user) => {
          const isOnline = activeUsers.includes(user._id);
          const lastMsg = user.lastMessage?.text || "";
          return (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={user._id}
              onClick={() => onSelectUser(user)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 15px",
                cursor: "pointer",
                background: "#fff",
                borderBottom: "1px solid #f0f0f0",
                borderRadius: "8px",
                margin: "5px",
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                color={isOnline ? "success" : "default"}
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{
                    width: 50,
                    height: 50,
                    border: isOnline ? "2px solid #4caf50" : "2px solid #ccc",
                  }}
                />
              </Badge>

              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: "#111",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {lastMsg}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isOnline ? "success.main" : "text.secondary",
                  }}
                >
                  {isOnline ? "Online" : "Offline"}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
    </Box>
  );
};

export default ChatSidebar;
