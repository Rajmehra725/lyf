// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Box, Fab, Tooltip, Typography } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import Navbar from "../../components/Navbar1";
import Sidebar from "../../components/Sidebar";
import HomeFeed from "../../components/HomeFeed";
import MyProfile from "../../components/ProfileFeed";
import CreatePostDialog from "../../components/CreatePostDialog";
import Lyf from "../../components/Lyf";
import Settings from "../../components/Settings";
import Notifications from "../../components/Notifications";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [activePage, setActivePage] = useState("home");

  // ✅ Refresh feed after post
  const handlePostCreated = () => {
    setOpen(false);
    setRefreshFeed(!refreshFeed);
  };

  // ✅ Page switcher
  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return <MyProfile />;
      case "settings":
        return <Settings />;
      case "notifications":
        return <Notifications />;
      case "lyf":
        return <Lyf />;
      default:
        return <HomeFeed key={refreshFeed} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #ff6ec4, #7873f5, #43e97b, #38f9d7)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
        color: "#fff",
        transition: "all 0.4s ease",
      }}
    >
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebar(true)} />

      {/* Sidebar */}
      <Sidebar
        open={sidebar}
        onClose={() => setSidebar(false)}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebar(false);
        }}
      />

      {/* Page Content */}
      <Box
        sx={{
          flex: 1,
          mt: 9,
          px: { xs: 1.5, md: 3 },
          py: 2,
          borderRadius: "20px",
          backdropFilter: "blur(8px)",
          background: "rgba(0, 0, 0, 0.25)",
          boxShadow: "0 0 25px rgba(255,255,255,0.15)",
          mx: { xs: 1, md: 2 },
          mb: 4,
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {renderPage()}
      </Box>

      {/* Floating Create Post Button */}
      {activePage === "home" && (
        <>
          <Tooltip title="Create Post">
            <Fab
              sx={{
                position: "fixed",
                bottom: 30,
                right: 30,
                background:
                  "linear-gradient(135deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
                color: "#fff",
                boxShadow: "0 0 25px rgba(255,255,255,0.4)",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 0 35px rgba(255,255,255,0.6)",
                },
                transition: "all 0.3s ease-in-out",
              }}
              onClick={() => setOpen(true)}
            >
              <FaPlus size={22} />
            </Fab>
          </Tooltip>

          <CreatePostDialog
            open={open}
            onClose={() => setOpen(false)}
            onPostCreated={handlePostCreated}
          />
        </>
      )}

      {/* Optional footer (can be static if you want) */}
      <Box
        component="footer"
        sx={{
          py: 1.5,
          textAlign: "center",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "0.5px",
        }}
      >
        © {new Date().getFullYear()} Love Your Life 💖
      </Box>

      {/* Animation for background */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}
