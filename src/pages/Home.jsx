import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Box,
  CircularProgress,
  TextField,
  Button,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaCommentDots, FaShareAlt } from "react-icons/fa";
import moment from "moment";

const API_BASE = "https://raaznotes-backend.onrender.com/api";

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [newComment, setNewComment] = useState({});

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUserId = userData?._id;

  // 📦 Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Post fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Like or Unlike a post
  const toggleLike = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE}/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // 💬 Add comment
  const handleAddComment = async (postId) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      const res = await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        { text: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...p.comments, res.data] }
            : p
        )
      );

      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Comment add error:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress color="warning" />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", p: 2 }}>
      {posts.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mt: 10 }}
        >
          No posts yet 💤
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={8} md={5} key={post._id}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* 👤 User info */}
                  <CardHeader
                    avatar={
                      <Avatar
                        src={post.author?.profilePicture?.url || ""}
                        sx={{
                          bgcolor: "#ff7043",
                          textTransform: "uppercase",
                        }}
                      >
                        {!post.author?.profilePicture?.url &&
                          post.author?.name?.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Typography variant="subtitle1" fontWeight="600">
                        {post.author?.name || "Unknown User"}
                      </Typography>
                    }
                    subheader={moment(post.createdAt).fromNow()}
                  />

                  {/* 🖼️ Post image */}
                  {post.mediaUrl && (
                    <CardMedia
                      component="img"
                      height="400"
                      image={post.mediaUrl}
                      alt="Post Media"
                      sx={{ objectFit: "cover" }}
                    />
                  )}

                  {/* ❤️ Like / 💬 Comment / 🔗 Share */}
                  <Box display="flex" alignItems="center" px={2} pt={1}>
                    <IconButton onClick={() => toggleLike(post._id)}>
                      {post.likes?.includes(currentUserId) ? (
                        <FaHeart color="red" size={20} />
                      ) : (
                        <FaRegHeart size={20} />
                      )}
                    </IconButton>

                    <IconButton onClick={() => toggleExpand(post._id)}>
                      <FaCommentDots size={20} />
                    </IconButton>

                    <IconButton>
                      <FaShareAlt size={20} />
                    </IconButton>
                  </Box>

                  {/* 👍 Like count */}
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.primary"
                    px={2}
                  >
                    {post.likes?.length || 0} likes
                  </Typography>

                  {/* 📝 Caption */}
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.primary">
                      <strong>{post.author?.name}</strong> {post.content}
                    </Typography>
                    {post.feelingType && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 0.5 }}
                      >
                        Feeling {post.feelingType.replace("-", " ")}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {moment(post.createdAt).format("MMM D, YYYY • h:mm A")}
                    </Typography>
                  </CardContent>

                  {/* 💬 Comments */}
                  <Collapse
                    in={expanded[post._id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <CardContent
                      sx={{ borderTop: "1px solid #eee", pt: 1 }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ mb: 1 }}
                      >
                        Comments
                      </Typography>

                      {post.comments.length === 0 ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          No comments yet
                        </Typography>
                      ) : (
                        post.comments.map((c, i) => (
                          <Box key={i} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              <strong>{c.user?.name || "User"}:</strong>{" "}
                              {c.text}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {moment(c.createdAt).fromNow()}
                            </Typography>
                          </Box>
                        ))
                      )}

                      {/* ➕ Add comment */}
                      <Box
                        display="flex"
                        alignItems="center"
                        mt={2}
                        gap={1}
                      >
                        <TextField
                          variant="outlined"
                          size="small"
                          placeholder="Add a comment..."
                          fullWidth
                          value={newComment[post._id] || ""}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#ff7043",
                            "&:hover": {
                              backgroundColor: "#ff5722",
                            },
                          }}
                          onClick={() => handleAddComment(post._id)}
                        >
                          Post
                        </Button>
                      </Box>
                    </CardContent>
                  </Collapse>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HomeFeed;
