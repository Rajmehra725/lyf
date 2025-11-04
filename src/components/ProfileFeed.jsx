// src/components/MyProfile.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  IconButton,
  Modal,
  TextField,
  Button,
  CircularProgress,
  CardActions,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const API = "https://raaznotes-backend.onrender.com/api";

export default function MyProfile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  // ✅ Fetch user data and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/";
          return;
        }

        // Get logged-in user
        const userRes = await axios.get(`${API}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userRes.data;
        setUserData(user);

        // Get user's posts
        const postsRes = await axios.get(`${API}/posts/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };
    fetchData();
  }, []);

  // ❤️ Like toggle
  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedPost = res.data;
      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // 🗑️ Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // ✏️ Edit
  const handleEdit = (post) => {
    setIsEditing(true);
    setSelectedPost(post);
    setContent(post.content);
    setFile(null);
    setOpenModal(true);
  };

  // ➕ Create
  const handleCreate = () => {
    setIsEditing(false);
    setContent("");
    setFile(null);
    setOpenModal(true);
  };

  // 💾 Save (Create or Update)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      if (file) formData.append("file", file);

      let res;
      if (isEditing && selectedPost) {
        res = await axios.put(`${API}/posts/${selectedPost._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts((prev) =>
          prev.map((p) => (p._id === selectedPost._id ? res.data : p))
        );
      } else {
        res = await axios.post(`${API}/posts`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts((prev) => [res.data, ...prev]);
      }

      setOpenModal(false);
      setIsEditing(false);
      setContent("");
      setFile(null);
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  return (
    <Container sx={{ mt: 10, color: "white", pb: 6 }}>
      {/* 🔹 Profile Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          mb: 5,
          textAlign: "center",
        }}
      >
        <Avatar
          src={userData?.profilePicture}
          sx={{
            width: 120,
            height: 120,
            border: "3px solid #ff9966",
            boxShadow: "0 0 15px #ff9966",
          }}
        />

        <Box>
          <Typography variant="h5" fontWeight="bold">
            {userData?.name || "User"}
          </Typography>
          <Typography variant="body2" color="gray" mb={2}>
            @{userData?.email}
          </Typography>

          {/* Counts */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 2 }}>
            <Box>
              <Typography fontWeight="bold">{posts.length}</Typography>
              <Typography variant="caption" color="gray">
                Posts
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">1.2k</Typography>
              <Typography variant="caption" color="gray">
                Followers
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight="bold">320</Typography>
              <Typography variant="caption" color="gray">
                Following
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            sx={{
              color: "#ff9966",
              borderColor: "#ff9966",
              borderRadius: "25px",
              px: 3,
              "&:hover": { backgroundColor: "#ff996620" },
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* 🧠 Create Button */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          startIcon={<FaPlus />}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #ff9966, #ff5e62)",
            borderRadius: "30px",
            px: 4,
          }}
          onClick={handleCreate}
        >
          Create New Post
        </Button>
      </Box>

      {/* 🔹 Posts Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography textAlign="center" mt={5}>
          You haven’t posted anything yet 💭
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 3,
          }}
        >
          {posts.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
                overflow: "hidden",
                backdropFilter: "blur(6px)",
                boxShadow: "0 0 10px rgba(255,255,255,0.1)",
              }}
            >
              {p.mediaUrl &&
                (p.mediaUrl.match(/\.(mp4|mov|mkv|webm)$/i) ? (
                  <video
                    src={p.mediaUrl}
                    controls
                    style={{ width: "100%", height: 300, objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={p.mediaUrl}
                    alt="post"
                    style={{ width: "100%", height: 300, objectFit: "cover" }}
                  />
                ))}

              <Box sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {p.content}
                </Typography>
                <Typography variant="caption" color="gray">
                  {dayjs(p.createdAt).fromNow()}
                </Typography>
              </Box>

              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <IconButton onClick={() => toggleLike(p._id)}>
                  {p.likes?.includes(userData?._id) ? (
                    <FaHeart color="#ff5e62" />
                  ) : (
                    <FaRegHeart color="white" />
                  )}
                </IconButton>
                <Typography variant="caption" color="white">
                  {p.likes?.length || 0} likes
                </Typography>

                <Box>
                  <IconButton onClick={() => handleEdit(p)}>
                    <FaEdit color="#00e5ff" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(p._id)}>
                    <FaTrash color="#ff4d4d" />
                  </IconButton>
                </Box>
              </CardActions>
            </motion.div>
          ))}
        </Box>
      )}

      {/* 🧾 Modal for Create/Edit */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#222",
            p: 4,
            borderRadius: 3,
            color: "white",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2}>
            {isEditing ? "Edit Post ✏️" : "Create New Post 🚀"}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#ff9966" },
              },
            }}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "15px" }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(45deg, #ff9966, #ff5e62)",
              "&:hover": { opacity: 0.9 },
            }}
            onClick={handleSave}
          >
            {isEditing ? "Update Post" : "Create Post"}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
