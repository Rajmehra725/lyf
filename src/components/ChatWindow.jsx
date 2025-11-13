import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import {
  FaPaperPlane,
  FaImage,
  FaSmile,
  FaCheck,
  FaCheckDouble,
  FaHeart,
  FaLaugh,
  FaFire,
  FaThumbsUp,
} from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import io from "socket.io-client";
import { motion } from "framer-motion";

const BACKEND = "https://raaznotes-backend.onrender.com";
const socket = io(BACKEND, { transports: ["websocket"] });

const ChatWindow = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [online, setOnline] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const token = localStorage.getItem("token");

  // 📩 Fetch Messages
  useEffect(() => {
    if (!selectedUser?._id || !currentUser?._id) return;
    setMessages([]);
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BACKEND}/api/chat/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(
          res.data.map((m) => ({
            ...m,
            isMine: m.sender._id === currentUser._id,
          }))
        );
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser?._id, currentUser?._id, token]);

  // ⚡ Socket Setup
  useEffect(() => {
    if (!currentUser?._id) return;
    socket.emit("join", currentUser._id);

    socket.on("onlineUsers", (list) => {
      if (selectedUser?._id) setOnline(list.includes(selectedUser._id));
    });

    socket.on("userTyping", (senderId) => {
      if (senderId === selectedUser._id) setIsTyping(true);
    });

    socket.on("userStopTyping", (senderId) => {
      if (senderId === selectedUser._id) setIsTyping(false);
    });

    socket.on("newMessage", (msg) => {
      if (msg.sender === selectedUser._id || msg.receiver === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          { ...msg, isMine: msg.sender === currentUser._id },
        ]);
        socket.emit("messageSeen", { messageId: msg._id, receiverId: msg.sender });
      }
    });

    socket.on("messageSeenAck", (messageId) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, isSeen: true } : m
        )
      );
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("newMessage");
      socket.off("messageSeenAck");
    };
  }, [selectedUser?._id, currentUser?._id]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧠 Typing logic
  const handleTyping = (e) => {
    const val = e.target.value;
    setText(val);
    socket.emit("typing", { senderId: currentUser._id, receiverId: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
      });
    }, 1500);
  };

  // 📤 Send Message
  const handleSend = async () => {
    if (!text.trim() && !media) return;
    try {
      const formData = new FormData();
      formData.append("receiverId", selectedUser._id);
      formData.append("text", text);
      if (media) formData.append("media", media);

      const res = await axios.post(`${BACKEND}/api/chat/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newMsg = { ...res.data.data, isMine: true };
      setMessages((prev) => [...prev, newMsg]);
      socket.emit("sendMessage", newMsg);
      setText("");
      setMedia(null);
      setShowEmoji(false);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  // ❤️ React to Message
  const handleOpenReaction = (event, messageId) => {
    setAnchorEl(event.currentTarget);
    setActiveMessageId(messageId);
  };
  const handleCloseReaction = () => {
    setAnchorEl(null);
    setActiveMessageId(null);
  };
  const reactToMessage = async (emoji) => {
    if (!activeMessageId) return;
    try {
      await axios.put(
        `${BACKEND}/api/chat/react/${activeMessageId}`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((m) =>
          m._id === activeMessageId ? { ...m, reaction: emoji } : m
        )
      );
      handleCloseReaction();
    } catch (err) {
      console.error("React error:", err);
    }
  };

  if (!selectedUser || !currentUser) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#777",
        }}
      >
        <Typography>Select a user to start chatting 💬</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Avatar src={selectedUser.avatar} sx={{ mr: 2 }} />
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 600 }}>
            {selectedUser.name}
          </Typography>
         <Typography sx={{ fontSize: 12, color: "#aaf" }}>
  {online
    ? "Online"
    : isTyping
    ? "Typing..."
    : selectedUser.lastSeen
    ? (() => {
        const lastSeenDate = new Date(selectedUser.lastSeen);
        const now = new Date();
        const diff = Math.floor((now - lastSeenDate) / 60000); // minutes

        if (diff < 1) return "last seen just now";
        if (diff < 60) return `last seen ${diff} minute${diff > 1 ? "s" : ""} ago`;
        if (diff < 1440)
          return `last seen today at ${lastSeenDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        return `last seen on ${lastSeenDate.toLocaleDateString()} at ${lastSeenDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      })()
    : "last seen a while ago"}
</Typography>

        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: isMobile ? 1.5 : 3,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: "#25D366", mx: "auto", my: 4 }} />
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              style={{
                display: "flex",
                justifyContent: msg.isMine ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: "75%",
                  bgcolor: msg.isMine
                    ? "linear-gradient(135deg, #25D366, #128C7E)"
                    : "rgba(255,255,255,0.15)",
                  color: msg.isMine ? "#fff" : "#eee",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={(e) => handleOpenReaction(e, msg._id)}
              >
                {msg.media && msg.media.length > 0 && (
                  <img
                    src={msg.media[0]}
                    alt="upload"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginBottom: "6px",
                    }}
                  />
                )}
                {msg.text}

                {/* Reaction */}
                {msg.reaction && (
                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: -18,
                      right: 10,
                      fontSize: "1.1rem",
                    }}
                  >
                    {msg.reaction}
                  </Typography>
                )}

                {/* Time + Seen */}
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    textAlign: "right",
                    opacity: 0.8,
                    mt: 0.3,
                  }}
                >
                  {msg.isMine &&
                    (msg.isSeen ? (
                      <FaCheckDouble size={10} color="#0ff" />
                    ) : (
                      <FaCheck size={10} />
                    ))}{" "}
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </motion.div>
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Emoji Reaction Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseReaction}>
        <MenuItem onClick={() => reactToMessage("❤️")}>❤️</MenuItem>
        <MenuItem onClick={() => reactToMessage("😂")}>😂</MenuItem>
        <MenuItem onClick={() => reactToMessage("🔥")}>🔥</MenuItem>
        <MenuItem onClick={() => reactToMessage("👍")}>👍</MenuItem>
      </Menu>

      {/* Input Area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: isMobile ? 1 : 2,
          gap: 1,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <IconButton component="label">
          <FaImage color="#25D366" size={20} />
          <input
            hidden
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </IconButton>

        <IconButton onClick={() => setShowEmoji(!showEmoji)}>
          <FaSmile color="#ffc107" size={22} />
        </IconButton>

        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "1rem",
            color: "#fff",
            background: "transparent",
          }}
        />

        <IconButton onClick={handleSend}>
          <FaPaperPlane color="#25D366" size={22} />
        </IconButton>

        {showEmoji && (
          <Box
            sx={{
              position: "absolute",
              bottom: "70px",
              left: "10px",
              zIndex: 10,
            }}
          >
            <EmojiPicker onEmojiClick={(e) => setText(text + e.emoji)} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
