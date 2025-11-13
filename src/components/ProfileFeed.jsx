import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Modal,
  TextField,
  IconButton,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaTrash,
  FaUserEdit,
  FaEllipsisH,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Picker } from 'emoji-mart';
import { io } from "socket.io-client";


import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API = "https://raaznotes-backend.onrender.com/api";
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

export default function Profile({ userId }) {
  const { user: currentUser, token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState({ followers: [], following: [] });
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [showConnections, setShowConnections] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(null);

  // Menu state for three dots
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPostId, setMenuPostId] = useState(null);

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isOwnProfile = !userId || currentUser._id === userId;
  const profileId = userId || currentUser._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(
          `${API}/users/${profileId === currentUser._id ? "me" : profileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(profileRes.data.user || profileRes.data);

        const postsRes = await axios.get(`${API}/posts/user/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const safePosts = (postsRes.data.posts || postsRes.data).map(p => ({
          ...p,
          likes: p.likes || [],
          comments: p.comments || [],
        }));
        setPosts(safePosts);

        const connRes = await axios.get(`${API}/follow/${profileId}/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(connRes.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [profileId, token, currentUser._id]);

  // Follow / Unfollow
  const handleFollow = async () => {
    try {
      await axios.post(`${API}/follow/${profileId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setConnections(prev => ({ ...prev, followers: [...prev.followers, currentUser] }));
    } catch (err) { console.error(err); }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`${API}/follow/${profileId}/unfollow`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setConnections(prev => ({ ...prev, followers: prev.followers.filter(f => f._id !== currentUser._id) }));
    } catch (err) { console.error(err); }
  };

  // Like posts
  const handleLike = async postId => {
    try {
      const res = await axios.put(`${API}/posts/${postId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(prev => prev.map(p => (p._id === postId ? { ...p, likes: res.data.likes || [] } : p)));
      if (selectedPost && selectedPost._id === postId)
        setSelectedPost({ ...selectedPost, likes: res.data.likes || [] });
    } catch (err) { console.error(err); }
  };

  const handleDoubleTapLike = postId => {
    handleLike(postId);
    setLikeAnimation(postId);
    setTimeout(() => setLikeAnimation(null), 800);
  };

  // Comment
  const handleComment = async postId => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${API}/posts/${postId}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => prev.map(p => (p._id === postId ? { ...p, comments: res.data.comments || [] } : p)));
      if (selectedPost && selectedPost._id === postId)
        setSelectedPost({ ...selectedPost, comments: res.data.comments || [] });
      setComment("");
      setShowEmojiPicker(false);
    } catch (err) { console.error(err); }
  };

  // Delete post
  const handleDeletePost = async postId => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API}/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(posts.filter(p => p._id !== postId));
      setSelectedPost(null);
      setAnchorEl(null);
    } catch (err) { console.error(err); }
  };

  // Delete comment
  const handleDeleteComment = async (postId, commentId) => {
  if (!window.confirm("Delete this comment?")) return;
  try {
    await axios.delete(`${API}/posts/${postId}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Instantly update UI
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, comments: (p.comments || []).filter(c => c._id !== commentId) }
          : p
      )
    );
    if (selectedPost && selectedPost._id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        comments: (prev.comments || []).filter(c => c._id !== commentId),
      }));
    }

    // 🔥 Emit to others via socket
    socket.emit("comment-deleted", { postId, commentId });
  } catch (err) {
    console.error(err);
  }
};

  if (!user) return <Typography sx={{ mt: 4 }}>Loading profile...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      {/* Cover & Avatar */}
      <Box sx={{
        height: 200,
        borderRadius: "16px",
        backgroundImage: `url(${user.coverPhoto || "https://via.placeholder.com/900x300"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        <Avatar
          src={user.avatar || "https://via.placeholder.com/150"}
          sx={{ width: 120, height: 120, position: "absolute", bottom: -60, left: 30, border: "4px solid white", cursor: "pointer" }}
        />
      </Box>

      {/* Profile Info */}
      <Box sx={{ mt: 8, px: 2 }}>
        <Typography variant="h5" fontWeight={600}>{user.name}</Typography>
        <Typography variant="body2" sx={{ color: "gray" }}>{user.email}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{user.bio || "No bio yet"}</Typography>

        <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
          <Typography sx={{ cursor: "pointer" }} onClick={() => setShowConnections(true)}>
            <strong>{connections.followers?.length || 0}</strong> Followers
          </Typography>
          <Typography sx={{ cursor: "pointer" }} onClick={() => setShowConnections(true)}>
            <strong>{connections.following?.length || 0}</strong> Following
          </Typography>
          <Typography><strong>{posts.length}</strong> Posts</Typography>
        </Box>

        {isOwnProfile ? (
          <Button variant="contained" sx={{ mt: 2, borderRadius: "30px" }} startIcon={<FaUserEdit />}>
            Edit Profile
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ mt: 2, borderRadius: "30px" }}
            onClick={connections.followers?.some(f => f._id === currentUser._id) ? handleUnfollow : handleFollow}
          >
            {connections.followers?.some(f => f._id === currentUser._id) ? "Unfollow" : "Follow"}
          </Button>
        )}
      </Box>

      {/* Posts Grid */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {posts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 2,
                  position: "relative",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                  height: 350, // Fixed height like Instagram
                }}
                onClick={() => setSelectedPost(post)}
                onDoubleClick={() => handleDoubleTapLike(post._id)}
              >
                {/* Three-dot Menu */}
                {isOwnProfile && (
                  <>
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 5, right: 5, zIndex: 10 }}
                      onClick={e => { e.stopPropagation(); setAnchorEl(e.currentTarget); setMenuPostId(post._id); }}
                    >
                      <FaEllipsisH />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuPostId === post._id}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem onClick={() => handleDeletePost(post._id)}>Delete</MenuItem>
                    </Menu>
                  </>
                )}

                {/* Heart Animation */}
                <AnimatePresence>
                  {likeAnimation === post._id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        color: "red",
                        fontSize: 60,
                        zIndex: 10,
                      }}
                    >
                      ❤️
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Media */}
                {post.mediaUrl && /\.(mp4|mov|webm|mkv)$/i.test(post.mediaUrl) ? (
                  <video src={post.mediaUrl} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <img src={post.mediaUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}

                {/* Post Info */}
                <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleLike(post._id); }} size="small">
                      {post.likes?.includes(currentUser._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                    </IconButton>
                    <Typography variant="body2">{post.likes?.length || 0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaCommentDots />
                    <Typography variant="body2">{post.comments?.length || 0}</Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Post Modal */}
      <Modal open={!!selectedPost} onClose={() => setSelectedPost(null)}>
        <Box sx={{ background: "#fff", borderRadius: 3, width: "90%", maxWidth: 800, mx: "auto", my: 8, p: 3, maxHeight: "80vh", overflowY: "auto" }}>
          {selectedPost && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar src={user.avatar} sx={{ mr: 2 }} />
                <Typography>{user.name}</Typography>
              </Box>

              <Box sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
                {/\.(mp4|mov|webm|mkv)$/i.test(selectedPost.mediaUrl) ? (
                  <video src={selectedPost.mediaUrl} controls style={{ width: "100%", borderRadius: 8 }} />
                ) : (
                  <img src={selectedPost.mediaUrl} alt="" style={{ width: "100%", borderRadius: 8 }} />
                )}
              </Box>

              <Typography sx={{ mb: 2 }}>{selectedPost.content}</Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton onClick={() => handleLike(selectedPost._id)}>
                  {selectedPost.likes?.includes(currentUser._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                </IconButton>
                <Typography sx={{ mr: 2 }}>{selectedPost.likes?.length || 0}</Typography>
                <FaCommentDots />
                <Typography sx={{ ml: 0.5 }}>{selectedPost.comments?.length || 0}</Typography>
              </Box>

              <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
                {(selectedPost.comments || []).map(c => (
                  <Box key={c._id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography><strong>{c.user.name}</strong>: {c.text}</Typography>
                    {(c.user._id === currentUser._id || isOwnProfile) && (
                      <IconButton onClick={() => handleDeleteComment(selectedPost._id, c._id)}>
                        <FaTrash color="red" size={15} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  fullWidth
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyPress={e => { if (e.key === "Enter") handleComment(selectedPost._id); }}
                />
                <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</Button>
                <Button onClick={() => handleComment(selectedPost._id)}>Post</Button>
              </Box>

              {showEmojiPicker && (
                <Box sx={{ mt: 1 }}>
                  <Picker
                    set="apple"
                    onSelect={emoji => setComment(prev => prev + emoji.native)}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>

      {/* Connections Modal */}
      <Modal open={showConnections} onClose={() => setShowConnections(false)}>
        <Box sx={{ background: "#fff", borderRadius: 3, width: 400, mx: "auto", my: 8, p: 3 }}>
          <Typography variant="h6">Connections</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Followers:</Typography>
          <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
            {(connections.followers || []).map(f => (
              <Box key={f._id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar src={f.avatar} sx={{ mr: 1, width: 30, height: 30 }} />
                <Typography>{f.name}</Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Following:</Typography>
          <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
            {(connections.following || []).map(f => (
              <Box key={f._id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar src={f.avatar} sx={{ mr: 1, width: 30, height: 30 }} />
                <Typography>{f.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
