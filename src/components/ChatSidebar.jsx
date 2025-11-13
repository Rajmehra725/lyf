import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  TextField,
  Badge,
  IconButton,
  useMediaQuery,
  Switch,
} from "@mui/material";
import { motion } from "framer-motion";
import io from "socket.io-client";
import axios from "axios";
import { FiSun, FiMoon, FiMessageSquare } from "react-icons/fi";

const socket = io("https://raaznotes-backend.onrender.com");

const ChatSidebar = ({ currentUser, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem("token");
  const isMobile = useMediaQuery("(max-width:768px)");

  // ✅ Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get(
          "https://raaznotes-backend.onrender.com/api/auth/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Fetch users error:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // ✅ Socket setup (online users, typing, messages)
  useEffect(() => {
    if (!currentUser?._id) return;

    socket.emit("join", currentUser._id);

    // 🟢 Listen online users
    socket.on("onlineUsers", (list) => setActiveUsers(list));

    // 🟣 Listen typing events
    socket.on("typing", (userId) => {
      setTypingUsers((prev) => [...new Set([...prev, userId])]);
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }, 2000);
    });

    // 🟡 Listen last message updates
    socket.on("newMessage", (data) => {
      const { senderId, receiverId, message } = data;
      const chatPartnerId =
        currentUser._id === senderId ? receiverId : senderId;

      setLastMessages((prev) => ({
        ...prev,
        [chatPartnerId]: {
          text: message.text,
          time: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      }));

      // Increment unread count if user is not currently opened
      if (receiverId === currentUser._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("newMessage");
    };
  }, [currentUser]);

  if (loading)
    return (
      <CircularProgress
        sx={{
          display: "block",
          mx: "auto",
          my: 5,
          color: "#25D366",
        }}
      />
    );

  // 🎨 Theme colors
  const bgColor = darkMode ? "#111b21" : "#fff";
  const headerColor = darkMode ? "#202c33" : "#f0f2f5";
  const textColor = darkMode ? "#e9edef" : "#111";
  const subTextColor = darkMode ? "#8696a0" : "#777";
  const borderColor = darkMode ? "#2a3942" : "#eee";

  const filteredUsers = users.filter(
    (u) =>
      u._id !== currentUser?._id &&
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 340,
        height: "100vh",
        bgcolor: bgColor,
        color: textColor,
        borderRight: isMobile ? "none" : `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: headerColor,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chats
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            size="small"
          />
          <IconButton size="small">
            {darkMode ? (
              <FiSun color="#25D366" size={18} />
            ) : (
              <FiMoon size={18} />
            )}
          </IconButton>
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            sx={{ width: 35, height: 35 }}
          />
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, py: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            bgcolor: darkMode ? "#202c33" : "#fff",
            input: { color: textColor },
            "& .MuiOutlinedInput-root": {
              fontSize: 14,
              height: 36,
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Users */}
      {filteredUsers.map((user) => {
        const isOnline = activeUsers.includes(user._id);
        const isTyping = typingUsers.includes(user._id);
        const lastMsg = lastMessages[user._id]?.text || "Say hi 👋";
        const lastTime = lastMessages[user._id]?.time || "";
        const unread = unreadCounts[user._id] || 0;

        return (
          <motion.div
            whileHover={{ scale: 1.02 }}
            key={user._id}
            onClick={() => {
              onSelectUser(user);
              setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 15px",
              cursor: "pointer",
              borderBottom: `1px solid ${borderColor}`,
              background: darkMode ? "#111b21" : "#fff",
              transition: "0.2s ease",
            }}
          >
            <Box sx={{ position: "relative", mr: 2 }}>
              <Avatar src={user.avatar} alt={user.name} />
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  bgcolor: isOnline ? "#25D366" : "gray",
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  border: `2px solid ${bgColor}`,
                  animation: isOnline ? "pulse 1.5s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)", opacity: 0.8 },
                    "50%": { transform: "scale(1.3)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 0.8 },
                  },
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  color: textColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: subTextColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {isTyping ? (
                  <span style={{ color: "#25D366" }}>typing...</span>
                ) : (
                  lastMsg
                )}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right", ml: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: subTextColor, fontSize: 11 }}
              >
                {lastTime}
              </Typography>
              {unread > 0 && (
                <Badge
                  badgeContent={unread}
                  color="success"
                  sx={{ "& .MuiBadge-badge": { fontSize: 10 } }}
                />
              )}
            </Box>
          </motion.div>
        );
      })}

      {/* Floating new chat */}
      {!isMobile && (
        <IconButton
          sx={{
            position: "fixed",
            bottom: 25,
            right: 25,
            bgcolor: "#25D366",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            "&:hover": { bgcolor: "#22bb5f" },
          }}
        >
          <FiMessageSquare size={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default ChatSidebar;
