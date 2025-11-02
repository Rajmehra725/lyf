import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Avatar,
  IconButton,
  CardActions,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaCommentDots, FaShareAlt } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api";

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // ✅ Load user + posts on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    fetchPosts();
  }, []);

  // ✅ Fetch all posts
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

  // ✅ Like toggle (frontend only)
  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Delete post
  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete post.");
    }
  };

  // ✅ Open comment modal
  const handleOpenComments = (post) => {
    setSelectedPost(post);
    setComments(post.comments || []);
    setOpenCommentModal(true);
  };

  // ✅ Add comment
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/posts/${selectedPost._id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newComment = res.data;
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment("");

      // update feed
      setPosts((prev) =>
        prev.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ✅ Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API}/posts/${selectedPost._id}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedComments = comments.filter((c) => c._id !== commentId);
      setComments(updatedComments);

      // Update main posts
      setPosts((prev) =>
        prev.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        )
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <Container sx={{ mt: 10, pb: 6 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : posts.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "white", mt: 10 }}
        >
          No posts yet. Tap + to share your first feeling! 🌸
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {posts.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: "hidden",
                  backdropFilter: "blur(6px)",
                }}
              >
                {p.mediaUrl &&
                  (p.mediaUrl.match(/\.(mp4|mov|mkv|webm)$/i) ? (
                    <video
                      src={p.mediaUrl}
                      controls
                      style={{
                        width: "100%",
                        height: 250,
                        objectFit: "cover",
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
                      }}
                    />
                  ))}

                <Box sx={{ p: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={p.author?.profilePicture}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="#fff"
                    >
                      {p.author?.name || "Unknown"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "#fff", whiteSpace: "pre-line" }}
                  >
                    {p.content}
                  </Typography>

                  <CardActions sx={{ p: 0, mt: 1 }}>
                    <IconButton onClick={() => toggleLike(p._id)}>
                      {likes[p._id] ? (
                        <FaHeart color="red" />
                      ) : (
                        <FaRegHeart color="white" />
                      )}
                    </IconButton>

                    <IconButton color="inherit" onClick={() => handleOpenComments(p)}>
                      <FaCommentDots />
                    </IconButton>

                    <IconButton color="inherit">
                      <FaShareAlt />
                    </IconButton>

                    {(userData?._id === p.author?._id ||
                      userData?.role === "admin") && (
                      <IconButton onClick={() => handleDeletePost(p._id)}>
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

      {/* ✅ Comments Modal */}
      <Modal open={openCommentModal} onClose={() => setOpenCommentModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "#222",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
            color: "#fff",
          }}
        >
          <Typography variant="h6" mb={2}>
            Comments 💬
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
            {comments.length === 0 ? (
              <Typography variant="body2" color="gray">
                No comments yet.
              </Typography>
            ) : (
              comments.map((c) => (
                <Box
                  key={c._id}
                  sx={{
                    mb: 1,
                    borderBottom: "1px solid #333",
                    pb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">
                    <strong>{c.author?.name || "User"}:</strong> {c.text}
                  </Typography>

                  {(userData?._id === c.author?._id ||
                    userData?.role === "admin") && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      <FiTrash2 color="red" size={15} />
                    </IconButton>
                  )}
                </Box>
              ))
            )}
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              input: { color: "white" },
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ff5e62" },
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddComment}
            sx={{
              background: "linear-gradient(45deg, #ff9966, #ff5e62)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Post Comment
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
