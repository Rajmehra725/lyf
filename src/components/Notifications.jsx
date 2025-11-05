import React, { useState } from "react";
import { Container, Box, Typography, Switch, Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaBell, FaEnvelopeOpenText, FaPaperPlane } from "react-icons/fa";

export default function NotificationMessagePanel() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
  });

  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome back, Raaz! 🎉", time: "2 min ago" },
    { id: 2, text: "Your profile was updated successfully ✅", time: "1 hr ago" },
    { id: 3, text: "New event added in dashboard 🚀", time: "Yesterday" },
  ]);

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 30px rgba(120,115,245,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            width: "100%",
            textAlign: "center",
            animation: "aurora 8s infinite linear",
          }}
        >
          {/* 🔔 Notifications Settings */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
            }}
          >
            <FaBell style={{ marginRight: 8 }} /> Notifications Settings
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
              p: 2,
              borderRadius: "12px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Email Notifications</Typography>
            <Switch
              checked={settings.emailNotifications}
              onChange={() => toggleSetting("emailNotifications")}
              color="secondary"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
              p: 2,
              borderRadius: "12px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Push Notifications</Typography>
            <Switch
              checked={settings.pushNotifications}
              onChange={() => toggleSetting("pushNotifications")}
              color="secondary"
            />
          </Box>

          {/* 💬 Messages Section */}
          <Typography
            variant="h6"
            sx={{
              mt: 5,
              fontWeight: 700,
              background: "linear-gradient(90deg,#43e97b,#38f9d7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            <FaEnvelopeOpenText style={{ marginRight: 6 }} /> Messages
          </Typography>

          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              textAlign: "left",
              pr: 1,
            }}
          >
            {messages.length > 0 ? (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{
                    marginBottom: "10px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "10px 15px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem", color: "#fff" }}>
                    {msg.text}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.8rem", color: "#ccc", mt: 0.5 }}
                  >
                    {msg.time}
                  </Typography>
                </motion.div>
              ))
            ) : (
              <Typography sx={{ color: "#aaa" }}>No messages yet.</Typography>
            )}
          </Box>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                py: 1,
                px: 3,
                borderRadius: "25px",
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 0 30px rgba(255,255,255,0.4)",
                },
              }}
              onClick={() =>
                setMessages([
                  ...messages,
                  {
                    id: messages.length + 1,
                    text: "New message sent successfully! ✨",
                    time: "Just now",
                  },
                ])
              }
            >
              <FaPaperPlane style={{ marginRight: 8 }} /> Send Test Message
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 0 30px #ff6ec4; }
          25% { box-shadow: 0 0 40px #7873f5; }
          50% { box-shadow: 0 0 35px #43e97b; }
          75% { box-shadow: 0 0 40px #38f9d7; }
          100% { box-shadow: 0 0 30px #ff6ec4; }
        }
      `}</style>
    </Container>
  );
}
