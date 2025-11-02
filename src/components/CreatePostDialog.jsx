import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import {
  FaSmile,
  FaFrown,
  FaFire,
  FaHeart as FaLove,
  FaLeaf,
} from "react-icons/fa";

const API = "https://raaznotes-backend.onrender.com/api";

export default function CreatePostDialog({ open, onClose, onPostCreated }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [feeling, setFeeling] = useState("happy");
  const [loading, setLoading] = useState(false);

  const feelingIcons = {
    happy: <FaSmile color="#fbc02d" />,
    sad: <FaFrown color="#64b5f6" />,
    motivated: <FaFire color="#ef5350" />,
    "in-love": <FaLove color="#e91e63" />,
    calm: <FaLeaf color="#81c784" />,
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) {
      alert("Please write something or upload media!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      formData.append("feelingType", feeling);
      if (media) formData.append("file", media);

      const res = await axios.post(`${API}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Update Dashboard instantly
      if (onPostCreated) onPostCreated(res.data);

      // Reset form and close dialog
      setContent("");
      setMedia(null);
      setPreview("");
      setFeeling("happy");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          background: "linear-gradient(135deg, #ff9966, #ff5e62)",
          color: "white",
          width: { xs: "90%", sm: 450 },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        💭 Share Your Feelings
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* 🌈 Feeling Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "white" }}>Select Feeling</InputLabel>
            <Select
              value={feeling}
              label="Feeling"
              onChange={(e) => setFeeling(e.target.value)}
              sx={{
                color: "white",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 2,
              }}
            >
              <MenuItem value="happy">😊 Happy</MenuItem>
              <MenuItem value="sad">😢 Sad</MenuItem>
              <MenuItem value="motivated">💪 Motivated</MenuItem>
              <MenuItem value="in-love">❤️ In Love</MenuItem>
              <MenuItem value="calm">🌿 Calm</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography variant="body2">
              Feeling: {feelingIcons[feeling]}{" "}
              <b style={{ textTransform: "capitalize" }}>{feeling}</b>
            </Typography>
          </Box>

          {/* ✍️ Content Input */}
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            label="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              mb: 2,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              input: { color: "white" },
              label: { color: "white" },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          {/* 📸 File Upload */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{
                background: "#fff",
                color: "#ff5e62",
                "&:hover": { background: "#ffe0e0" },
              }}
            >
              Upload Media
              <input type="file" hidden onChange={handleMediaChange} />
            </Button>
          </Box>

          {/* 🖼️ Preview */}
          {preview && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              {preview.match(/\.(mp4|mov|mkv|webm)$/i) ? (
                <video
                  src={preview}
                  controls
                  style={{ width: "100%", borderRadius: 10 }}
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: 10 }}
                />
              )}
            </Box>
          )}

          {/* 🚀 Submit */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "#fff",
                color: "#ff5e62",
                fontWeight: "bold",
                "&:hover": { background: "#ffe0e0" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#ff5e62" }} />
              ) : (
                "Post Now"
              )}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
