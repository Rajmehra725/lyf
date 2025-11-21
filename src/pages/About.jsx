import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaComment,
  FaShoppingCart,
  FaCameraRetro,
  FaNewspaper,
  FaMusic,
  FaBook,
  FaLaptopCode,
  FaPlane,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Raj from "./Raj.jpeg";
// ---------------- Website Features ----------------
const websiteFeatures = [
  {
    icon: <FaComment size={28} color="#f06292" />,
    title: "Instagram-like Posts",
    description: "Upload posts, like, comment, and share just like Instagram.",
  },
  {
    icon: <FaComment size={28} color="#4fc3f7" />,
    title: "Real-time Chat",
    description: "Instant messaging system to chat with other users in real-time.",
  },
  {
    icon: <FaNewspaper size={28} color="#ffb74d" />,
    title: "Real-time News Feed",
    description: "Stay updated with the latest news posts in real-time.",
  },
  {
    icon: <FaCameraRetro size={28} color="#81c784" />,
    title: "Wedding Image QR System",
    description: "Upload wedding images and generate QR codes for easy sharing.",
  },
  {
    icon: <FaShoppingCart size={28} color="#ba68c8" />,
    title: "E-commerce System",
    description: "Product upload, cart, and checkout system like Amazon.",
  },
  {
    icon: <FaComment size={28} color="#ff8a65" />,
    title: "Admin Control Panel",
    description: "Manage users, posts, and products efficiently with admin access.",
  },
];

// ---------------- Personal Info ----------------
const hobbies = [
  { icon: <FaMusic size={32} color="#f06292" />, name: "Music" },
  { icon: <FaBook size={32} color="#4fc3f7" />, name: "Reading" },
  { icon: <FaLaptopCode size={32} color="#81c784" />, name: "Coding" },
  { icon: <FaPlane size={32} color="#ffb74d" />, name: "Travel" },
];

// ---------------- Counter ----------------
const Counter = ({ end, duration = 1.5 }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(counter);
  }, [end, duration]);

  return <Typography variant="h5" color="primary">{count}</Typography>;
};

// ---------------- Personal Info Tab ----------------
const PersonalInfoTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={{ mt: 3, p: 3 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Avatar
            src={Raj}
            alt="Raaz Mehra"
            sx={{
              width: 180,
              height: 180,
              mx: "auto",
              mb: 2,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
          <Typography variant="h4" gutterBottom>Raaz Mehra</Typography>
          <Typography variant="body1" gutterBottom>Software Engineer | MERN Developer</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Education</Typography>
          <Typography variant="body2" paragraph>
            Started schooling in a small village, always passionate about mathematics. Joined School for Excellence, Seoni, then returned to village school to continue studies in favorite subject Maths. Completed B.Tech in Computer Science Engineering from AKS University, Satna.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Achievements & Research</Typography>
          <Typography variant="body2" paragraph>
            Published a research paper on Green Technology with best friend Siddharth Vishwakarma (Pricee Baby). Recognized by HOD and mentors for innovative work and dedication.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Professional Experience</Typography>
          <Typography variant="body2" paragraph>
            Completed internship in Rewa and currently working as a software engineer, developing projects from home. Engaged in teaching students and sharing knowledge to inspire future coders.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Personal Story</Typography>
          <Typography variant="body2" paragraph>
            From childhood curiosity in mathematics to dreaming of hacking and exploring complex systems, Raaz’s journey is full of learning, exploration, and creativity.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Achievements / Counters</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around", my: 2, flexWrap: "wrap", gap: 3 }}>
            <Box>
              <Typography>Projects</Typography>
              <Counter end={12} />
            </Box>
            <Box>
              <Typography>Posts</Typography>
              <Counter end={150} />
            </Box>
            <Box>
              <Typography>Skills</Typography>
              <Counter end={5} />
            </Box>
            <Box>
              <Typography>Experience (Years)</Typography>
              <Counter end={2} />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Hobbies & Interests</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, my: 2, flexWrap: "wrap" }}>
            {hobbies.map((hobby, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                {hobby.icon}
                <Typography variant="body2">{hobby.name}</Typography>
              </motion.div>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom color="primary">Social Links</Typography>
          <Box mt={1}>
            {[{ icon: <FaFacebook />, link: "https://facebook.com" },
              { icon: <FaInstagram />, link: "https://instagram.com" },
              { icon: <FaLinkedin />, link: "https://linkedin.com" },
              { icon: <FaGithub />, link: "https://github.com" }].map((social, idx) => (
                <Button
                  key={idx}
                  href={social.link}
                  target="_blank"
                  sx={{ mx: 1, transition: "transform 0.3s", "&:hover": { transform: "scale(1.2)" } }}
                >
                  {social.icon}
                </Button>
              ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ---------------- Main About Page ----------------
const About = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Website Info" />
        <Tab label="About Me" />
      </Tabs>

      {/* Website Info Tab */}
      {tabIndex === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">About Lyf</Typography>
          <Typography variant="body1" paragraph>
            <strong>Lyf</strong> stands for <em>Love Your Feelings</em> and <em>Love Your Life</em>. 
            A social platform with Instagram-like posts, real-time chat, news feed, e-commerce, wedding image QR system, and admin control.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              mt: 2,
            }}
          >
            {websiteFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    p: 2,
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                    transition: "0.3s",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box sx={{ mb: 1 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                    <Typography variant="body2">{feature.description}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      )}

      {/* About Me Tab */}
      {tabIndex === 1 && <PersonalInfoTab />}
    </Box>
  );
};

export default About;
