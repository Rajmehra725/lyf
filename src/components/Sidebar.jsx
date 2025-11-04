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
          width: 260,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          borderRight: "2px solid rgba(255,255,255,0.1)",
        },
      }}
    >
      {/* 🔹 User Info */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Avatar
          src={user.profilePicture}
          sx={{
            width: 80,
            height: 80,
            margin: "auto",
            border: "2px solid #ff5e62",
          }}
        />
        <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
          {user.name}
        </Typography>
        <Typography variant="body2" color="gray">
          @{user.email?.split("@")[0]}
        </Typography>
      </Box>

      {/* 🔹 Sidebar Menu */}
      <List sx={{ mt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("home")}>
            <FiHome size={20} style={{ marginRight: 12 }} />
            <ListItemText primary="Home Feed" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("profile")}>
            <FiUser size={20} style={{ marginRight: 12 }} />
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("lyf")}>
            <FiHeart
              size={20}
              style={{ marginRight: 12, color: "#ff4d4d" }}
            />
            <ListItemText primary="Lyf" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("notifications")}>
            <FiBell size={20} style={{ marginRight: 12 }} />
            <ListItemText primary="Notifications" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("settings")}>
            <FiSettings size={20} style={{ marginRight: 12 }} />
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ background: "rgba(255,255,255,0.2)", my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <FiLogOut size={20} style={{ marginRight: 12 }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
