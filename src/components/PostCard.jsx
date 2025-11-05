// src/components/PostCard.jsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  Modal,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api";

export default function PostCard({ post, token, onUpdate }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentModal, setCommentModal] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ❤️ Like / Unlike
  const handleLike = async () => {
    try {
      const res = await axios.put(`${API}/posts/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLiked(res.data.liked);
      setLikeCount(res.data.likesCount);
      onUpdate && onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // 💬 Add Comment
  const handleComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/posts/${post._id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${API}/posts/${post._id}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <CardHeader
            avatar={<Avatar src={post.author.avatar} />}
            title={post.author.name}
            subheader={new Date(post.createdAt).toLocaleString()}
            subheaderTypographyProps={{ color: "#ccc" }}
          />
          {post.mediaUrl && (
            <CardMedia
              component="img"
              height="400"
              image={post.mediaUrl}
              alt="Post media"
              sx={{
                objectFit: "cover",
              }}
            />
          )}
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {post.content}
            </Typography>

            {/* ❤️ Like & 💬 Comment Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <IconButton onClick={handleLike} sx={{ color: liked ? "#ff4b91" : "#fff" }}>
                {liked ? <FaHeart /> : <FaRegHeart />}
              </IconButton>
              <Typography>{likeCount}</Typography>

              <IconButton onClick={() => setCommentModal(true)} sx={{ color: "#fff" }}>
                <FaCommentDots />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* 💬 Comment Modal */}
      <Modal open={commentModal} onClose={() => setCommentModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "rgba(20,20,20,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 3,
            p: 3,
            color: "#fff",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Comments</Typography>
            <IconButton onClick={() => setCommentModal(false)} sx={{ color: "#fff" }}>
              <FaTimes />
            </IconButton>
          </Box>

          {comments.length === 0 && (
            <Typography sx={{ color: "#aaa", mb: 2 }}>No comments yet.</Typography>
          )}

          {comments.map((c) => (
            <Box
              key={c._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                p: 1,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={c.user.avatar} sx={{ width: 30, height: 30 }} />
                <Typography variant="body2">{c.user.name}</Typography>
              </Box>
              <Typography variant="body2" sx={{ flex: 1, ml: 2, color: "#ddd" }}>
                {c.text}
              </Typography>
              <IconButton
                size="small"
                sx={{ color: "#ff6ec4" }}
                onClick={() => handleDeleteComment(c._id)}
              >
                <FaTrash size={13} />
              </IconButton>
            </Box>
          ))}

          <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              variant="outlined"
              size="small"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputProps={{
                style: {
                  color: "#fff",
                  borderRadius: "20px",
                },
              }}
            />
            <Button
              onClick={handleComment}
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(90deg,#43e97b,#38f9d7)",
                borderRadius: "20px",
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : "Send"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
