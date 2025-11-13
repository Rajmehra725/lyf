import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
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
import { notifyNewMessage } from "./NotificationToast";

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
  const token = localStorage.getItem("token");

  // ✅ Fetch messages (safe)
  useEffect(() => {
    if (!selectedUser?._id || !currentUser?._id) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND}/api/chat/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const msgs = res.data.map((m) => ({
          ...m,
          isMine: m.sender._id === currentUser._id,
        }));
        setMessages(msgs);
      } catch (err) {
        console.error("❌ Fetch messages error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser?._id, currentUser?._id, token]);

  // ✅ Socket setup (safe)
  useEffect(() => {
    if (!currentUser?._id) return;

    socket.emit("join", currentUser._id);

    const handleNewMessage = (msg) => {
      if (
        msg.sender === selectedUser?._id ||
        msg.receiver === selectedUser?._id
      ) {
        setMessages((prev) => [
          ...prev,
          { ...msg, isMine: msg.sender === currentUser._id },
        ]);
      }
      if (msg.sender !== currentUser._id && selectedUser) {
        notifyNewMessage(selectedUser.name, msg.text);
      }
    };

    const handleSeen = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isSeen: true } : m))
      );
    };

    const handleTyping = (userId) => {
      if (userId === selectedUser?._id) setIsTyping(true);
    };
    const handleStopTyping = (userId) => {
      if (userId === selectedUser?._id) setIsTyping(false);
    };

    const handleOnlineUsers = (list) => {
      if (selectedUser?._id) setOnline(list.includes(selectedUser._id));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSeen", handleSeen);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSeen", handleSeen);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [selectedUser?._id, currentUser?._id]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    const val = e.target.value;
    setText(val);
    if (!selectedUser?._id || !currentUser?._id) return;
    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
    setTimeout(
      () =>
        socket.emit("stopTyping", {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
        }),
      1500
    );
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

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
      console.error("❌ Send message error:", err);
    }
  };

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
      console.error("❌ React error:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${BACKEND}/api/chat/delete/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      socket.emit("deleteMessage", messageId);
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ✅ Early return moved BELOW hooks
  if (!selectedUser || !currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Select a user to start chatting 💬
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #eee",
          backgroundColor: "#fff",
        }}
      >
        <Avatar src={selectedUser.avatar} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="h6">{selectedUser.name}</Typography>
          {online ? (
            <Typography color="success.main">Online</Typography>
          ) : isTyping ? (
            <Typography color="primary">Typing...</Typography>
          ) : (
            <Typography color="text.secondary">Last seen recently</Typography>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          messages.map((msg) => (
            <Box
              key={msg._id}
              sx={{
                display: "flex",
                justifyContent: msg.isMine ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.isMine ? "#1976d2" : "#e0e0e0",
                  color: msg.isMine ? "#fff" : "#000",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "70%",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={(e) => handleOpenReaction(e, msg._id)}
              >
                {msg.media &&
                  msg.media.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="upload"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        marginBottom: "5px",
                      }}
                    />
                  ))}

                {msg.text}

                {msg.reaction && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -15,
                      right: 0,
                      fontSize: "1.2rem",
                    }}
                  >
                    {msg.reaction}
                  </span>
                )}

                {msg.isMine && (
                  <Typography
                    onClick={() => handleDeleteMessage(msg._id)}
                    sx={{
                      fontSize: "0.75rem",
                      textAlign: "right",
                      color: "red",
                      cursor: "pointer",
                      mt: 0.3,
                    }}
                  >
                    Unsend
                  </Typography>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    bottom: -15,
                    right: 5,
                    fontSize: "0.7rem",
                    color: msg.isMine ? "#fff" : "#555",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  {msg.isSeen ? <FaCheckDouble size={12} /> : <FaCheck size={12} />}
                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                </Box>
              </Box>
            </Box>
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Reaction Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseReaction}>
        <MenuItem onClick={() => reactToMessage("❤️")}><FaHeart color="red" /> ❤️</MenuItem>
        <MenuItem onClick={() => reactToMessage("😂")}><FaLaugh color="orange" /> 😂</MenuItem>
        <MenuItem onClick={() => reactToMessage("🔥")}><FaFire color="red" /> 🔥</MenuItem>
        <MenuItem onClick={() => reactToMessage("👍")}><FaThumbsUp color="blue" /> 👍</MenuItem>
      </Menu>

      {/* Input Area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderTop: "1px solid #eee",
          bgcolor: "#fff",
          position: "relative",
        }}
      >
        <IconButton component="label">
          <FaImage size={22} />
          <input
            hidden
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </IconButton>

        <IconButton onClick={() => setShowEmoji(!showEmoji)}>
          <FaSmile size={22} />
        </IconButton>

        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "1rem",
            background: "transparent",
          }}
        />

        <IconButton onClick={handleSend}>
          <FaPaperPlane size={22} color="#1976d2" />
        </IconButton>

        {showEmoji && (
          <Box sx={{ position: "absolute", bottom: "60px", left: "10px", zIndex: 10 }}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatWindow;
