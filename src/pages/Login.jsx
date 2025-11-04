import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("https://raaznotes-backend.onrender.com/api/auth/login", form);

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;
        setMessage("✨ Login successful! Redirecting...");

        setTimeout(() => {
          if (role === "admin") navigate("/admin-dashboard");
          else navigate("/dashboard");
        }, 1200);
      } else {
        setMessage("Invalid response from server.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
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
              💕 Welcome Back to LYF
            </Typography>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              required
              InputProps={{
                style: {
                  color: "#fff",
                  borderRadius: "12px",
                },
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff6ec4",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#43e97b",
                  },
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
              InputProps={{
                style: {
                  color: "#fff",
                  borderRadius: "12px",
                },
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff6ec4",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#43e97b",
                  },
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
                {loading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
          </form>

          {/* Signup Link */}
          <Typography sx={{ mt: 3, color: "#ddd", fontSize: "0.9rem" }}>
            Don’t have an account?{" "}
            <Link
              component="button"
              onClick={() => navigate("/signup")}
              sx={{
                color: "#43e97b",
                fontWeight: "bold",
                "&:hover": {
                  color: "#ff6ec4",
                },
              }}
            >
              Sign up here
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
