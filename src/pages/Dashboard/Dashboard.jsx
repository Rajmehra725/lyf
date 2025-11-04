// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import Navbar from "../../components/Navbar1";
import Sidebar from "../../components/Sidebar";
import HomeFeed from "../../components/HomeFeed";
import MyProfile from "../../components/ProfileFeed";
import CreatePostDialog from "../../components/CreatePostDialog";
// (You can create dummy components for now)
import Lyf from "../../components/Lyf";
import Settings from "../../components/Settings";
import Notifications from "../../components/Notifications";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [activePage, setActivePage] = useState("home"); // 👈 current page

  // ✅ Refresh feed after post
  const handlePostCreated = () => {
    setOpen(false);
    setRefreshFeed(!refreshFeed);
  };

  // ✅ Component switching logic
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
        background: "linear-gradient(135deg, #ff9966, #ff5e62)",
        color: "#fff",
        transition: "all 0.4s ease",
      }}
    >
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebar(true)} />

      {/* Sidebar with page control */}
      <Sidebar
        open={sidebar}
        onClose={() => setSidebar(false)}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebar(false);
        }}
      />

      {/* Dynamic content */}
      <Box sx={{ flex: 1, mt: 8, px: 2 }}>{renderPage()}</Box>

      {/* Floating Post Button */}
      {activePage === "home" && (
        <>
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

          <CreatePostDialog
            open={open}
            onClose={() => setOpen(false)}
            onPostCreated={handlePostCreated}
          />
        </>
      )}
    </Box>
  );
}
