// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Drawer, Box, Avatar, Typography, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api";

export default function Sidebar({ open, onClose }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        },
      }}
    >
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Avatar
          src={userData?.profilePicture}
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            border: "2px solid #ff9966",
          }}
        />
        <Typography variant="h6" sx={{ mt: 1 }}>
          {userData?.name || "User"}
        </Typography>
      </Box>
      <Divider sx={{ background: "rgba(255,255,255,0.3)", my: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onClose}>
            <ListItemText primary="🏠 Home Feed" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="🚪 Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
