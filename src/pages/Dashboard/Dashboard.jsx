// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import Navbar from "../../components/Navbar1";
import Sidebar from "../../components/Sidebar";
import HomeFeed from "../../components/HomeFeed";
import CreatePostDialog from "../../components/CreatePostDialog";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false); // 👈 Add this

  // ✅ Ye function HomeFeed ko refresh karne ke liye trigger karega
  const handlePostCreated = () => {
    setOpen(false);
    setRefreshFeed(!refreshFeed); // 👈 Toggle refresh
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #ff9966, #ff5e62)",
        color: "#fff",
      }}
    >
      <Navbar onMenuClick={() => setSidebar(true)} />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />

      {/* 👇 Pass refreshFeed as key */}
      <HomeFeed key={refreshFeed} />

      <Tooltip title="Create Post">
        <Fab
          color="secondary"
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "#ff5e62",
            "&:hover": { background: "#ff3d50" },
          }}
          onClick={() => setOpen(true)}
        >
          <FaPlus />
        </Fab>
      </Tooltip>

      {/* 👇 Pass callback */}
      <CreatePostDialog open={open} onClose={() => setOpen(false)} onPostCreated={handlePostCreated} />
    </Box>
  );
}
