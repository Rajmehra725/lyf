// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    "जहाँ प्रेम है, वहीं राधा हैं। जहाँ राधा हैं, वहीं कृष्ण हैं। 🌸",
    "Love Your Life — क्योंकि यह स्वयं राधारानी की कृपा का प्रतिबिंब है। 💕",
    "प्रेम वह नहीं जो पाता है, प्रेम वह है जो देता है। 💫",
    "भक्ति से भरा हृदय ही सच्चा जीवन है। 🌿",
  ];

 
  // Auto change quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

 
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://th.bing.com/th/id/OIP.D9mZfKsPAP9I-Pb92x3K6QHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Overlay Blur */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(10px) brightness(0.7)",
          background: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Floating hearts */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
          animate={{ y: ["100vh", "-10vh"], opacity: [1, 0] }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.2,
          }}
          style={{
            position: "absolute",
            color: "#ffb6c1",
            fontSize: `${Math.random() * 20 + 15}px`,
          }}
        >
          <FaHeart />
        </motion.div>
      ))}

      {/* Content Box */}
      <Container
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          p: 5,
          borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 40px rgba(255,105,180,0.4)",
          border: "1px solid rgba(255,255,255,0.2)",
          animation: "aurora 8s infinite linear",
          maxWidth: 750,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            background:
              "linear-gradient(90deg,#ff6ec4,#7873f5,#43e97b,#38f9d7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
            letterSpacing: "1px",
          }}
        >
          💕 Love Your Life — राधारानी की कृपा 💕
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: "#eee",
            fontSize: "1.05rem",
            lineHeight: 1.8,
            textAlign: "justify",
          }}
        >
          राधारानी का प्रेम संसार का सबसे पवित्र प्रेम है।  
          उन्होंने हमें सिखाया कि सच्चा प्रेम पाने में नहीं, देने में है।  
          जब हम अपने भीतर की करुणा को जगाते हैं, तब ही जीवन “Love Your Life” बनता है।  
          वृंदावन की हर हवा में, हर बांसुरी की धुन में राधा का नाम बसता है।  
          उस प्रेम को महसूस करो, उसे जियो, वही सच्चा जीवन है। 🌸
        </Typography>

        {/* Dynamic Quote */}
        <Typography
          variant="h6"
          component={motion.div}
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            mt: 3,
            fontStyle: "italic",
            color: "#ffb6c1",
          }}
        >
          “{quotes[quoteIndex]}”
        </Typography>

        {/* Buttons */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={{
              color: "#43e97b",
              borderColor: "#43e97b",
              "&:hover": { background: "rgba(67,233,123,0.2)" },
            }}
          >
            🌿 Dashboard पर चलें
          </Button>

        </Box>

        {/* Signature */}
        <Typography
          variant="subtitle2"
          sx={{
            mt: 3,
            color: "#43e97b",
            fontStyle: "italic",
          }}
        >
          — राधे राधे 🌿 प्रेम में जीवन, जीवन में राधा 💞
        </Typography>
      </Container>

      {/* Aurora Light Animation */}
      <style>{`
        @keyframes aurora {
          0% { box-shadow: 0 0 30px #ff6ec4; }
          25% { box-shadow: 0 0 40px #7873f5; }
          50% { box-shadow: 0 0 35px #43e97b; }
          75% { box-shadow: 0 0 40px #38f9d7; }
          100% { box-shadow: 0 0 30px #ff6ec4; }
        }
      `}</style>
    </Box>
  );
}
