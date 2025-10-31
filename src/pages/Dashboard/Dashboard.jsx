import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Container,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  CardActions,
} from "@mui/material";
import {
  FaPlus,
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaShareAlt,
  FaSmile,
  FaFrown,
  FaFire,
  FaHeart as FaLove,
  FaLeaf,
} from "react-icons/fa";
import { FiLogOut, FiSend, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [feelingType, setFeelingType] = useState("happy");
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo();
    fetchPosts();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      handleLogout();
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file && !content.trim()) return alert("Please add content or file!");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      formData.append("feelingType", feelingType);
      if (file) formData.append("file", file);

      await axios.post(`${API}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setOpen(false);
      setContent("");
      setFile(null);
      await fetchPosts();
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const feelingIcons = {
    happy: <FaSmile color="#fbc02d" />,
    sad: <FaFrown color="#64b5f6" />,
    motivated: <FaFire color="#ef5350" />,
    "in-love": <FaLove color="#e91e63" />,
    calm: <FaLeaf color="#81c784" />,
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* 🔶 Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#ff6600" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Love Your Feelings 🧡
          </Typography>
          {userData && (
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Avatar src={userData.profilePicture} sx={{ mr: 1 }} />
              <Typography>{userData.name}</Typography>
            </Box>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <FiLogOut size={22} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ➕ Floating Button */}
      <Tooltip title="Create Post">
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "#ff6600",
            "&:hover": { background: "#e65100" },
          }}
          onClick={() => setOpen(true)}
        >
          <FaPlus />
        </Fab>
      </Tooltip>

      {/* 💬 Create Post Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Share Your Feelings 💭
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Feeling</InputLabel>
            <Select
              value={feelingType}
              label="Feeling"
              onChange={(e) => setFeelingType(e.target.value)}
            >
              <MenuItem value="happy">😊 Happy</MenuItem>
              <MenuItem value="sad">😢 Sad</MenuItem>
              <MenuItem value="motivated">💪 Motivated</MenuItem>
              <MenuItem value="in-love">❤️ In Love</MenuItem>
              <MenuItem value="calm">🌿 Calm</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="What's on your mind?"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ margin: "10px 0" }}
          />
          <Button
            variant="contained"
            fullWidth
            startIcon={<FiSend />}
            sx={{ background: "#ff6600", "&:hover": { background: "#e65100" } }}
            onClick={handleUpload}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Post"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* 📸 Posts Grid */}
      <Container sx={{ mt: 4, pb: 6 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress color="warning" />
          </Box>
        ) : posts.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "gray", mt: 5 }}
          >
            No posts yet. Tap + to create your first post! 🌸
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {posts.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Media */}
                  {p.mediaUrl ? (
                    p.mediaUrl.match(/\.(mp4|mov|mkv|webm)$/i) ? (
                      <video
                        src={p.mediaUrl}
                        controls
                        style={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <img
                        src={p.mediaUrl}
                        alt="post"
                        style={{
                          width: "100%",
                          height: 250,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    )
                  ) : null}

                  {/* Info Section */}
                  <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar src={p.author?.profilePicture} sx={{ width: 30, height: 30 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {p.author?.name || "Unknown"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {p.content}
                    </Typography>
                    <CardActions sx={{ p: 0, mt: 1 }}>
                      <IconButton onClick={() => toggleLike(p._id)}>
                        {likes[p._id] ? (
                          <FaHeart color="red" />
                        ) : (
                          <FaRegHeart color="gray" />
                        )}
                      </IconButton>
                      <IconButton>
                        <FaCommentDots />
                      </IconButton>
                      <IconButton>
                        <FaShareAlt />
                      </IconButton>
                      {(userData?._id === p.author?._id ||
                        userData?.role === "admin") && (
                        <IconButton onClick={() => handleDelete(p._id)}>
                          <FiTrash2 color="red" />
                        </IconButton>
                      )}
                    </CardActions>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
