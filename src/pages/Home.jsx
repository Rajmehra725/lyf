// src/pages/Home/Home.jsx
import React from "react";
import { Container, Box, Typography, Grid, Card, CardContent, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FaHeart, FaShieldAlt, FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";

// Motion version of MUI Button
const MotionButton = motion(Button);

const cardData = [
  {
    title: "Feelings ❤️",
    desc: "Express your feelings freely and track your emotions daily.\nअपने भावनाओं को व्यक्त करें और अपने मन की स्थिति को दैनिक रूप से ट्रैक करें।",
    icon: <FaHeart size={36} color="#e91e63" />,
    path: "/feelings",
  },
  {
    title: "Safety 🛡️",
    desc: "Protect your mind, body, and digital space.\nअपने मन, शरीर और डिजिटल स्पेस को सुरक्षित रखें।",
    icon: <FaShieldAlt size={36} color="#1976d2" />,
    path: "/safety",
  },
  {
    title: "Upload ☁️",
    desc: "Upload your memories safely via Cloudinary.\nअपनी यादों को सुरक्षित रूप से क्लाउड में अपलोड करें।",
    icon: <FaCloudUploadAlt size={36} color="#4caf50" />,
    path: "/upload",
  },
];

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          p: 6,
          borderRadius: 3,
          background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
          boxShadow: 4,
          mb: 6,
        }}
        component={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <FaHeart size={36} color="#e91e63" />
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            Welcome to LYF
          </Typography>
        </Stack>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Live Your Life. Love Your Feelings.<br />
          अपने जीवन को जियो। अपने भावनाओं से प्यार करो।<br />
          This is your emotional and digital safe space.<br />
          यह आपका भावनात्मक और डिजिटल सुरक्षित स्थान है।
        </Typography>

        <MotionButton
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/dashboard"
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
            px: 5,
            boxShadow: 3,
          }}
          whileHover={{ scale: 1.05 }}
        >
          Get Started / शुरू करें
        </MotionButton>
      </Box>

      {/* Quick Cards Section */}
      <Grid container spacing={4}>
        {cardData.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              sx={{
                textAlign: "center",
                p: 3,
                boxShadow: 3,
                borderRadius: 3,
                cursor: "pointer",
              }}
              onClick={() => window.location.href = card.path}
            >
              <Box sx={{ mb: 2 }}>{card.icon}</Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                  {card.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Testimonials / Quotes */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          What our users say / हमारे उपयोगकर्ता कहते हैं
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
          "LYF helped me express my emotions and feel safe online.<br />
          LYF ने मुझे अपनी भावनाओं को व्यक्त करने और ऑनलाइन सुरक्षित महसूस करने में मदद की।"
        </Typography>
      </Box>

      {/* Optional CTA Section */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <MotionButton
          variant="outlined"
          color="primary"
          size="large"
          component={Link}
          to="/dashboard"
          sx={{ textTransform: "none", fontWeight: "bold", px: 5, borderRadius: 3 }}
          whileHover={{ scale: 1.05 }}
        >
          Go to Dashboard / डैशबोर्ड पर जाएँ
        </MotionButton>
      </Box>
    </Container>
  );
}
