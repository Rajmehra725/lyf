// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 30px rgba(255,105,180,0.3)",
          animation: "aurora 8s infinite linear",
          color: "#fff",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            minHeight: "58px",
          }}
        >
          {/* Left: Menu */}
          <motion.div whileHover={{ scale: 1.15 }}>
            <IconButton
              color="inherit"
              onClick={onMenuClick}
              sx={{
                "&:hover": {
                  color: "#ff6ec4",
                  transition: "all 0.2s ease",
                },
              }}
            >
              <FiMenu size={22} />
            </IconButton>
          </motion.div>

          {/* Center: Title */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "1px",
                fontSize: { xs: "1rem", sm: "1.25rem" },
                userSelect: "none",
              }}
            >
              💕 Love Your Feelings
            </Typography>
          </motion.div>

          {/* Right: Profile & Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <motion.div whileHover={{ scale: 1.15 }}>
              <IconButton
                color="inherit"
                onClick={handleProfile}
                sx={{
                  "&:hover": { color: "#43e97b", transition: "all 0.2s ease" },
                }}
              >
                <FiUser size={21} />
              </IconButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }}>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  "&:hover": { color: "#ff6ec4", transition: "all 0.2s ease" },
                }}
              >
                <FiLogOut size={21} />
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Aurora Glow Animation */}
      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 0 25px #ff6ec4; }
          25% { box-shadow: 0 0 30px #7873f5; }
          50% { box-shadow: 0 0 25px #43e97b; }
          75% { box-shadow: 0 0 30px #38f9d7; }
          100% { box-shadow: 0 0 25px #ff6ec4; }
        }
      `}</style>
    </>
  );
}
