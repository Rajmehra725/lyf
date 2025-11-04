// src/components/Footer.jsx
import React from "react";
import { Box, Typography, Container, Link } from "@mui/material";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(15px)",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 -4px 25px rgba(255,105,180,0.3)",
        animation: "aurora 8s infinite linear",
        color: "#fff",
        textAlign: "center",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container maxWidth="md">
        {/* 🌐 Social Icons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            mb: 1.5,
          }}
        >
          {[
            { icon: <FaGithub />, link: "https://github.com/Rajmehra725" },
            { icon: <FaLinkedin />, link: "#" },
            { icon: <FaInstagram />, link: "#" },
            { icon: <FaTwitter />, link: "#" },
          ].map((item, index) => (
            <motion.a
              key={index}
              whileHover={{ scale: 1.25, rotate: 5 }}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "white",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#43e97b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "white")
              }
            >
              {item.icon}
            </motion.a>
          ))}
        </Box>

        {/* 💬 Footer Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.9rem",
              letterSpacing: "0.5px",
              color: "#eee",
            }}
          >
            &copy; {new Date().getFullYear()}{" "}
            <strong
              style={{
                background:
                  "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Love Your Feelings 💕
            </strong>{" "}
            | All rights reserved.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              fontSize: "0.8rem",
              color: "#ccc",
            }}
          >
            Crafted with <span style={{ color: "#ff6ec4" }}>❤️</span> by{" "}
            <strong>Raaz Mehra</strong> |{" "}
            <Link
              href="https://github.com/Rajmehra725"
              target="_blank"
              rel="noopener"
              sx={{
                color: "#43e97b",
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { color: "#ff6ec4" },
              }}
            >
              GitHub
            </Link>
          </Typography>
        </motion.div>
      </Container>

      {/* 🌈 Aurora Glow Animation */}
      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 -4px 25px #ff6ec4; }
          25% { box-shadow: 0 -4px 30px #7873f5; }
          50% { box-shadow: 0 -4px 25px #43e97b; }
          75% { box-shadow: 0 -4px 30px #38f9d7; }
          100% { box-shadow: 0 -4px 25px #ff6ec4; }
        }
      `}</style>
    </Box>
  );
};

export default Footer;
