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
import {
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaShareAlt,
} from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const API = "https://raaznotes-backend.onrender.com/api";

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    fetchPosts();
  }, []);

  // 🧠 Fetch Posts
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

  // ❤️ Like/Unlike Toggle (Smooth Instant Update)
  const toggleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id === postId) {
          const alreadyLiked = p.likes.includes(userData?._id);
          const updatedLikes = alreadyLiked
            ? p.likes.filter((id) => id !== userData._id)
            : [...p.likes, userData._id];
          return { ...p, likes: updatedLikes };
        }
        return p;
      })
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error toggling like:", err.response?.data || err.message);
    }
  };

  // 🗑️ Delete Post
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

  // 💬 Open Comments
  const handleOpenComments = (post) => {
    setSelectedPost(post);
    setComments(post.comments || []);
    setOpenCommentModal(true);
  };

  // ➕ Add Comment
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/posts/${selectedPost._id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = {
        ...res.data,
        author: {
          _id: userData._id,
          name: userData.name,
        },
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment("");

      setPosts((prev) =>
        prev.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ❌ Delete Comment
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
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: 500,
            mx: "auto",
          }}
        >
          {posts.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: "hidden",
                  backdropFilter: "blur(6px)",
                }}
              >
                {/* 👤 Username Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                  }}
                >
                  <Avatar
                    src={p.author?.profilePicture}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Typography variant="body1" fontWeight="bold" color="#fff">
                    {p.author?.name || "Unknown"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "gray", ml: "auto" }}
                  >
                    {dayjs(p.createdAt).fromNow()}
                  </Typography>
                </Box>

                {/* 🖼️ Post Media */}
                {p.mediaUrl &&
                  (p.mediaUrl.match(/\.(mp4|mov|mkv|webm)$/i) ? (
                    <video
                      src={p.mediaUrl}
                      controls
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={p.mediaUrl}
                      alt="post"
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                      }}
                    />
                  ))}

                {/* 📝 Caption */}
                <Box sx={{ px: 2, pt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#fff",
                      whiteSpace: "pre-line",
                      fontSize: "0.95rem",
                    }}
                  >
                    {p.content}
                  </Typography>

                  {/* 💬 Comments Preview */}
                  {p.comments && p.comments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {p.comments.slice(0, 3).map((c) => (
                        <Typography
                          key={c._id}
                          variant="body2"
                          sx={{ color: "#ccc", fontSize: "0.85rem" }}
                        >
                          <strong>{c.author?.name || "User"}:</strong> {c.text}
                        </Typography>
                      ))}

                      {p.comments.length > 3 && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#aaa",
                            mt: 0.5,
                            fontSize: "0.8rem",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenComments(p)}
                        >
                          View all {p.comments.length} comments
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* ❤️ Like + 💬 Comment + 🔁 Share */}
                <CardActions
                  sx={{ p: 1.5, mt: 1, justifyContent: "space-between" }}
                >
                  <Box>
                    <motion.div
                      whileTap={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      style={{ display: "inline-block" }}
                    >
                      <IconButton onClick={() => toggleLike(p._id)}>
                        {p.likes?.includes(userData?._id) ? (
                          <FaHeart color="red" size={20} />
                        ) : (
                          <FaRegHeart color="white" size={20} />
                        )}
                      </IconButton>
                    </motion.div>
                    <Typography
                      variant="caption"
                      sx={{ color: "white", ml: 0.5 }}
                    >
                      {p.likes?.length || 0}{" "}
                      {p.likes?.length === 1 ? "like" : "likes"}
                    </Typography>

                    <IconButton
                      color="inherit"
                      onClick={() => handleOpenComments(p)}
                    >
                      <FaCommentDots />
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{ color: "white", ml: 0.5 }}
                    >
                      {p.comments?.length || 0}
                    </Typography>
                  </Box>

                  <Box>
                    <IconButton color="inherit">
                      <FaShareAlt />
                    </IconButton>
                    {(userData?._id === p.author?._id ||
                      userData?.role === "admin") && (
                      <IconButton onClick={() => handleDeletePost(p._id)}>
                        <FiTrash2 color="red" />
                      </IconButton>
                    )}
                  </Box>
                </CardActions>
              </Box>
            </motion.div>
          ))}
        </Box>
      )}

      {/* 💬 Comments Modal */}
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
