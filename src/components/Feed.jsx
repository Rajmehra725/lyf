// src/components/Feed.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api";

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [activePost, setActivePost] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  // Like / Unlike
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${API}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: res.data.likes } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Add comment
  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `${API}/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: res.data.comments } : p))
      );
      setCommentText("");
      setActivePost(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {posts.map((post) => (
        <motion.div key={post._id} whileHover={{ scale: 1.01 }} layout>
          <Card
            sx={{
              mb: 3,
              borderRadius: "16px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          >
            <CardHeader
              avatar={<Avatar src={post.author?.avatar} />}
              title={post.author?.name}
              subheader={new Date(post.createdAt).toLocaleString()}
            />

            {post.mediaUrl && (
              <CardMedia
                component="img"
                height="300"
                image={post.mediaUrl}
                alt="Post Media"
                sx={{ objectFit: "cover" }}
              />
            )}

            <CardContent>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>

            <CardActions disableSpacing>
              <IconButton onClick={() => handleLike(post._id)}>
                {post.likes.includes(user._id) ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart />
                )}
              </IconButton>
              <Typography variant="body2">{post.likes.length}</Typography>

              <IconButton onClick={() => setActivePost(post._id)}>
                <FaCommentDots />
              </IconButton>
              <Typography variant="body2">{post.comments.length}</Typography>
            </CardActions>

            {/* Comment Section */}
            {activePost === post._id && (
              <Box sx={{ p: 2 }}>
                {post.comments.map((c, i) => (
                  <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                    <strong>{c.user?.name || "User"}:</strong> {c.text}
                  </Typography>
                ))}
                <Box display="flex" gap={1} mt={1}>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#ff5722" }}
                    onClick={() => handleComment(post._id)}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            )}
          </Card>
        </motion.div>
      ))}
    </Container>
  );
}
