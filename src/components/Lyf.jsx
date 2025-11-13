import React, { useState } from "react";
import { Grid, Box, IconButton, Drawer, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Sidebar for desktop */}
      {!isMobile && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: 340,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(15px)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 0 25px rgba(0,0,0,0.3)",
          }}
        >
          <ChatSidebar
            currentUser={currentUser}
            onSelectUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        </motion.div>
      )}

      {/* Sidebar for mobile (Drawer) */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "85%",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px)",
              color: "#fff",
            },
          }}
        >
          <ChatSidebar
            currentUser={currentUser}
            onSelectUser={(user) => {
              setSelectedUser(user);
              setSidebarOpen(false);
            }}
            selectedUser={selectedUser}
          />
        </Drawer>
      )}

      {/* Chat window */}
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {selectedUser ? (
          <ChatWindow
            currentUser={currentUser}
            selectedUser={selectedUser}
            onBack={() => setSidebarOpen(true)}
          />
        ) : (
          <>
            {isMobile && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  color: "#25D366",
                }}
              >
                <FaBars />
              </IconButton>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
                color: "#ccc",
              }}
            >
              Select a chat to start messaging 💬
            </motion.div>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
