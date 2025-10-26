'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { FaShieldAlt, FaPlusCircle, FaRegSmileBeam } from "react-icons/fa";

const API_BASE = "https://raaznotes-backend.onrender.com/api/safety";
 
// After deployment: "https://your-backend.onrender.com/api/safety"

export default function SafetyPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);

  // Fetch all safety tips (GET /api/safety/tips)
  const fetchSafetyTips = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tips`);
      setTips(res.data);
    } catch (err) {
      console.error("❌ Error fetching safety tips:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new tip (POST /api/safety/add)
  const addSafetyTip = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post(`${API_BASE}/add`, { title, content });
      setTitle("");
      setContent("");
      fetchSafetyTips();
    } catch (err) {
      console.error("❌ Error adding tip:", err);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchSafetyTips();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 6 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#ff6600" }}>
          🛡️ Safety Tips
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#666" }}>
          Live your life wisely — protect and guide your feelings 💖
        </Typography>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          component="form"
          onSubmit={addSafetyTip}
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
            mb: 4,
            background: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
            Add New Tip <FaPlusCircle color="#ff6600" />
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="warning"
            disabled={adding}
            sx={{ mt: 1 }}
          >
            {adding ? "Saving..." : "Add Tip"}
          </Button>
        </Box>
      </motion.div>

      {/* Loading Spinner */}
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
          <CircularProgress color="warning" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading safety tips...
          </Typography>
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {tips.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
              No tips yet. Be the first to share your wisdom! 🌱
            </Typography>
          ) : (
            tips.map((tip, index) => (
              <motion.div
                key={tip._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: "#fffaf5",
                  marginBottom: "20px",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" sx={{ color: "#ff6600", display: "flex", alignItems: "center", gap: 1 }}>
                  <FaShieldAlt /> {tip.title}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: "#333" }}>
                  {tip.content}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <FaRegSmileBeam color="#ff6600" />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Stay safe & positive
                  </Typography>
                </Box>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </Container>
  );
}
