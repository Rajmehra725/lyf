// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(90deg, rgba(255,165,0,0.2), rgba(255,105,180,0.2))",
        backdropFilter: "blur(15px)",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 20px rgba(255,105,180,0.3)",
        color: "#fff",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar>
        {/* Left Menu Icon */}
        <IconButton color="inherit" onClick={onMenuClick} sx={{ mr: 2 }}>
          <FiMenu />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #FFA500, #FF69B4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "1.3rem",
            letterSpacing: "1px",
          }}
        >
          Love Your Feelings 💕
        </Typography>

        {/* Right Side Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Profile Button */}
          <Button
            onClick={handleProfile}
            sx={{
              color: "#fff",
              textTransform: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "25px",
              px: 2,
              py: 0.5,
              "&:hover": {
                background: "linear-gradient(90deg, #FFA500, #FF69B4)",
                boxShadow: "0 0 10px rgba(255,105,180,0.4)",
              },
            }}
            startIcon={<FiUser />}
          >
            Profile
          </Button>

          {/* Logout */}
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              "&:hover": {
                color: "#FF69B4",
                transform: "scale(1.1)",
                transition: "all 0.2s",
              },
            }}
          >
            <FiLogOut />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
