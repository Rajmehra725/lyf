// src/pages/SettingsPanel.jsx
import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaUserEdit, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api";

export default function SettingsPanel() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    facebook: user?.socials?.facebook || "",
    instagram: user?.socials?.instagram || "",
    linkedin: user?.socials?.linkedin || "",
    github: user?.socials?.github || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || "");
  const [previewCover, setPreviewCover] = useState(user?.coverPhoto || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🧠 Handle Input Change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🖼️ File Preview
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "avatar") {
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      setCoverPhoto(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  // 💾 Save Profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("bio", form.bio);
      formData.append("facebook", form.facebook);
      formData.append("instagram", form.instagram);
      formData.append("linkedin", form.linkedin);
      formData.append("github", form.github);
      if (avatar) formData.append("avatar", avatar);
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);

      const res = await axios.put(`${API}/users/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update preview images to show the uploaded ones
      setPreviewAvatar(res.data.user.avatar?.startsWith("http") ? res.data.user.avatar : `${API}${res.data.user.avatar}`);
      setPreviewCover(res.data.user.coverPhoto?.startsWith("http") ? res.data.user.coverPhoto : `${API}${res.data.user.coverPhoto}`);

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Change Password
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword)
      return setMessage("⚠️ Please enter both old and new passwords.");
    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `${API}/users/me/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("🔑 Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Password update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ minHeight: "100vh", py: 8, display: "flex", justifyContent: "center" }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        sx={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.2)",
          p: 4,
          width: "100%",
          maxWidth: 600,
          color: "#fff",
          boxShadow: "0 0 30px rgba(255,105,180,0.3)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4,
            textAlign: "center",
          }}
        >
          <FaUserEdit style={{ marginRight: 8 }} />
          Edit Profile
        </Typography>

        {/* 🖼️ Image Previews */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src={previewAvatar}
            sx={{ width: 100, height: 100, mx: "auto", border: "2px solid #ff6ec4" }}
          />
          <Typography variant="caption" sx={{ color: "#aaa" }}>
            Profile Picture
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "avatar")}
            style={{ marginTop: "10px" }}
          />
        </Box>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          {previewCover && (
            <img
              src={previewCover}
              alt="Cover"
              style={{
                width: "100%",
                maxHeight: "150px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          )}
          <Typography variant="caption" sx={{ color: "#aaa" }}>
            Cover Photo
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "cover")}
            style={{ marginTop: "10px" }}
          />
        </Box>

        {/* 🧠 Basic Info */}
        <form onSubmit={handleProfileUpdate}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#ccc" } }}
          />
          <TextField
            label="Bio"
            name="bio"
            fullWidth
            multiline
            rows={3}
            value={form.bio}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#ccc" } }}
          />

          {/* 🌐 Socials */}
          <Typography sx={{ mt: 3, mb: 1, color: "#43e97b", fontWeight: 600 }}>
            Social Links
          </Typography>
          {[
            { name: "facebook", icon: <FaFacebook />, placeholder: "Facebook link" },
            { name: "instagram", icon: <FaInstagram />, placeholder: "Instagram link" },
            { name: "linkedin", icon: <FaLinkedin />, placeholder: "LinkedIn link" },
            { name: "github", icon: <FaGithub />, placeholder: "GitHub link" },
          ].map((s) => (
            <TextField
              key={s.name}
              name={s.name}
              fullWidth
              value={form[s.name]}
              onChange={handleChange}
              placeholder={s.placeholder}
              margin="dense"
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>{s.icon}</span>,
                style: { color: "#fff" },
              }}
            />
          ))}

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: "30px",
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save Profile"}
            </Button>
          </motion.div>
        </form>

        {/* 🔐 Password Section */}
        <Box sx={{ mt: 5 }}>
          <Typography sx={{ mb: 1, color: "#ff6ec4", fontWeight: 600 }}>
            Change Password
          </Typography>
          <TextField
            type="password"
            placeholder="Old Password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="dense"
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            type="password"
            placeholder="New Password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
            InputProps={{ style: { color: "#fff" } }}
          />

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              borderColor: "#ff6ec4",
              color: "#ff6ec4",
              borderRadius: "30px",
              "&:hover": { backgroundColor: "#ff6ec420" },
            }}
            onClick={handlePasswordChange}
          >
            Update Password
          </Button>
        </Box>

        {message && (
          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              color: message.includes("success") ? "#43e97b" : "#ff6ec4",
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
