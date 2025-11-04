// src/pages/Signup.jsx
import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Link } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://raaznotes-backend.onrender.com/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✨ Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 0 30px rgba(255,105,180,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
            animation: "aurora 8s infinite linear",
            color: "#fff",
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Title */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
                letterSpacing: "1px",
              }}
            >
              💖 Create Your LYF Account
            </Typography>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Name"
              name="name"
              onChange={handleChange}
              required
              InputProps={{ style: { color: "#fff", borderRadius: "12px" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6ec4" },
                  "&.Mui-focused fieldset": { borderColor: "#43e97b" },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              required
              InputProps={{ style: { color: "#fff", borderRadius: "12px" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6ec4" },
                  "&.Mui-focused fieldset": { borderColor: "#43e97b" },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              required
              InputProps={{ style: { color: "#fff", borderRadius: "12px" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6ec4" },
                  "&.Mui-focused fieldset": { borderColor: "#43e97b" },
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              required
              InputProps={{ style: { color: "#fff", borderRadius: "12px" } }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6ec4" },
                  "&.Mui-focused fieldset": { borderColor: "#43e97b" },
                },
              }}
            />

            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: "30px",
                  background:
                    "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
                  boxShadow: "0 0 15px rgba(255,255,255,0.3)",
                  "&:hover": {
                    boxShadow: "0 0 25px rgba(255,255,255,0.6)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                {loading ? "Creating..." : "Sign Up"}
              </Button>
            </motion.div>
          </form>

          {/* Login Link */}
          <Typography sx={{ mt: 3, color: "#ddd", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/login")}
              sx={{
                color: "#43e97b",
                fontWeight: "bold",
                "&:hover": { color: "#ff6ec4" },
              }}
            >
              Login here
            </Link>
          </Typography>

          {/* Message */}
          {message && (
            <Typography
              sx={{
                mt: 2,
                color: message.includes("successful") ? "#43e97b" : "#ff6ec4",
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </motion.div>

      {/* Aurora Animation */}
      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 0 30px #ff6ec4; }
          25% { box-shadow: 0 0 40px #7873f5; }
          50% { box-shadow: 0 0 35px #43e97b; }
          75% { box-shadow: 0 0 40px #38f9d7; }
          100% { box-shadow: 0 0 30px #ff6ec4; }
        }
      `}</style>
    </Container>
  );
}
