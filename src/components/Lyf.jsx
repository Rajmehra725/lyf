import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user")); // already logged-in user
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Grid container sx={{ height: "100vh", backgroundColor: "#fafafa" }}>
      <Grid item xs={12} md={4} lg={3} sx={{ borderRight: "1px solid #ddd", backgroundColor: "#fff" }}>
        <ChatSidebar
          currentUser={currentUser}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        {selectedUser ? (
          <ChatWindow currentUser={currentUser} selectedUser={selectedUser} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#777",
              fontSize: "1.2rem",
            }}
          >
            Select a chat to start messaging 💬
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatPage;
