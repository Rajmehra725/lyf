// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiBell,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";

export default function Sidebar({ open, onClose, onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "user@example.com",
    profilePicture: "",
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 270,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "4px 0 30px rgba(255,105,180,0.25)",
          animation: "aurora 10s infinite linear",
          color: "#fff",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      {/* User Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Avatar
          src={user.profilePicture}
          sx={{
            width: 85,
            height: 85,
            margin: "auto",
            border: "3px solid rgba(255,255,255,0.5)",
            boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 0 25px rgba(255,255,255,0.6)",
            },
          }}
        />
        <Typography
          variant="h6"
          sx={{
            mt: 1,
            fontWeight: "bold",
            background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.7, fontSize: "0.85rem", color: "#ccc" }}
        >
          @{user.email?.split("@")[0]}
        </Typography>
      </Box>

      {/* Menu List */}
      <List sx={{ mt: 2 }}>
        {[
          { icon: <FiHome />, label: "Home Feed", page: "home" },
          { icon: <FiUser />, label: "Profile", page: "profile" },
          { icon: <FiHeart />, label: "Lyf", page: "lyf" },
          { icon: <FiBell />, label: "Notifications", page: "notifications" },
          { icon: <FiSettings />, label: "Settings", page: "settings" },
        ].map((item, i) => (
          <ListItem disablePadding key={i}>
            <ListItemButton
              onClick={() => onNavigate(item.page)}
              sx={{
                mx: 1,
                my: 0.6,
                borderRadius: "12px",
                py: 1.2,
                color: "#fff",
                fontWeight: 500,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
                  boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 20,
                  mr: 1.5,
                }}
              >
                {item.icon}
              </Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ background: "rgba(255,255,255,0.3)", my: 2 }} />

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: "12px",
              py: 1.2,
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
                boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                mr: 1.5,
              }}
            >
              <FiLogOut />
            </Box>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Aurora Glow Animation */}
      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 0 25px #ff6ec4; }
          25% { box-shadow: 0 0 35px #7873f5; }
          50% { box-shadow: 0 0 25px #43e97b; }
          75% { box-shadow: 0 0 30px #38f9d7; }
          100% { box-shadow: 0 0 25px #ff6ec4; }
        }
      `}</style>
    </Drawer>
  );
}
