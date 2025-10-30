import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  TextField,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import axios from "axios";
import socket from "../../socket";
import { FaPlusCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);

  // 🧩 Fetch user info + posts on mount
  useEffect(() => {
    fetchUserInfo();
    fetchPosts();

    socket.on("post-created", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    return () => socket.off("post-created");
  }, []);

  // 🧍‍♂️ Fetch logged-in user info
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://raaznotes-backend.onrender.com/api/profile/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  // 🧾 Fetch all posts
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://raaznotes-backend.onrender.com/api/posts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  // 📤 Upload post
  const handleUpload = async () => {
    if (!file || !caption.trim()) {
      alert("Please select a file and add a caption!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", file);

      await axios.post(
        "https://raaznotes-backend.onrender.com/api/posts",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpen(false);
      setCaption("");
      setFile(null);
    } catch (err) {
      console.error("Error uploading post:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* 🧡 Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#ff6600" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Lyf 🧡
          </Typography>

          <Button
            color="inherit"
            onClick={() => setOpen(true)}
            startIcon={<FaPlusCircle />}
          >
            Post
          </Button>

          <IconButton color="inherit" onClick={handleLogout}>
            <FiLogOut size={22} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 🧍‍♂️ User Info Section */}
      {userData && (
        <Box
          sx={{
            mt: 3,
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={userData.avatar || ""}
            sx={{ width: 80, height: 80, mb: 1, bgcolor: "#ff6600" }}
          >
            {userData.name?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h6">
            Welcome, <strong>{userData.name}</strong> 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData.email}
          </Typography>
        </Box>
      )}

      {/* 🧾 All Posts */}
      <Container>
        {posts.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "gray", mt: 5 }}
          >
            No posts yet. Create your first post! 🌸
          </Typography>
        ) : (
          posts.map((p) => (
            <Card
              key={p._id}
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: 3,
                overflow: "hidden",
              }}
            >
              {p.media &&
                (p.media.endsWith(".mp4") ? (
                  <CardMedia component="video" src={p.media} controls />
                ) : (
                  <CardMedia
                    component="img"
                    image={p.media}
                    alt="post"
                    sx={{ objectFit: "cover", maxHeight: 400 }}
                  />
                ))}

              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {p.author?.name || "Unknown User"}
                </Typography>
                <Typography variant="body2">{p.caption}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      {/* 📤 Upload Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Container sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Post
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#ff6600" }}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Container>
      </Dialog>
    </>
  );
}
