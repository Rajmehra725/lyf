// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { motion } from "framer-motion";
import { FaRegUserCircle } from "react-icons/fa";

const navItems = [
  { text: "Home", path: "/" },
  { text: "Feelings", path: "/feelings" },
  { text: "Upload", path: "/upload" },
  { text: "Safety", path: "/safety" },
  { text: "About", path: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Drawer for mobile
  const drawer = (
    <Box
      sx={{
        textAlign: "center",
        py: 3,
        height: "100%",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.6))",
        backdropFilter: "blur(20px)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Love Your Life 💫
      </Typography>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)} // ✅ closes drawer on click
              sx={{
                color: "#fff",
                justifyContent: "center",
                borderRadius: "12px",
                mx: 2,
                my: 0.5,
                transition: "all 0.3s ease-in-out",
                background:
                  location.pathname === item.path
                    ? "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)"
                    : "transparent",
                "&:hover": {
                  background:
                    "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
                  boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                  transform: "scale(1.08)",
                },
              }}
            >
              <ListItemText
                primary={item.text}
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Login Icon */}
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            component={Link}
            to="/login"
            onClick={() => setMobileOpen(false)} // ✅ also closes drawer
            sx={{
              justifyContent: "center",
              "&:hover": { transform: "scale(1.2)" },
            }}
          >
            <FaRegUserCircle size={32} color="#fff" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 30px rgba(255, 105, 180, 0.3)",
          animation: "aurora 8s infinite linear",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.1, rotate: 3 }}>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "1px",
                textShadow: "0 0 20px rgba(255,255,255,0.4)",
              }}
            >
              LYF 💖
            </Typography>
          </motion.div>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <motion.div whileHover={{ scale: 1.15 }} key={item.text}>
                <Link
                  to={item.path}
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background:
                      location.pathname === item.path
                        ? "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)"
                        : "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                    transition: "all 0.4s",
                  }}
                >
                  {item.text}
                </Link>
              </motion.div>
            ))}

            {/* Login Avatar */}
            <motion.div whileHover={{ scale: 1.2 }}>
              <Link to="/login">
                <FaRegUserCircle
                  size={30}
                  color="#fff"
                  style={{ cursor: "pointer" }}
                />
              </Link>
            </motion.div>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              background:
                "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
              borderRadius: "50%",
              p: 1,
              boxShadow: "0 0 12px rgba(255,255,255,0.4)",
              "&:hover": { transform: "rotate(90deg)" },
              transition: "transform 0.3s ease",
            }}
          >
            <HiMenu size={26} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer (Mobile Menu) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Aurora animation */}
      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 0 30px #ff6ec4; }
          25% { box-shadow: 0 0 40px #7873f5; }
          50% { box-shadow: 0 0 35px #43e97b; }
          75% { box-shadow: 0 0 40px #38f9d7; }
          100% { box-shadow: 0 0 30px #ff6ec4; }
        }
      `}</style>
    </>
  );
}
