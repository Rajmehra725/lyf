// src/pages/Connections.jsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import API from "../api/axiosInstance";

export default function Connections() {
  const { id } = useParams();
  const [connections, setConnections] = useState({ followers: [], following: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data } = await API.get(`/users/${id}/connections`);
        setConnections(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ py: 5, color: "#fff" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          👥 Connections
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Followers
            </Typography>
            <List>
              {connections.followers.length > 0 ? (
                connections.followers.map((user) => (
                  <React.Fragment key={user._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={user.avatar} />
                      </ListItemAvatar>
                      <ListItemText primary={user.name} secondary={`@${user.username}`} />
                    </ListItem>
                    <Divider sx={{ background: "rgba(255,255,255,0.1)" }} />
                  </React.Fragment>
                ))
              ) : (
                <Typography sx={{ color: "#ccc" }}>No followers</Typography>
              )}
            </List>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Following
            </Typography>
            <List>
              {connections.following.length > 0 ? (
                connections.following.map((user) => (
                  <React.Fragment key={user._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={user.avatar} />
                      </ListItemAvatar>
                      <ListItemText primary={user.name} secondary={`@${user.username}`} />
                    </ListItem>
                    <Divider sx={{ background: "rgba(255,255,255,0.1)" }} />
                  </React.Fragment>
                ))
              ) : (
                <Typography sx={{ color: "#ccc" }}>Not following anyone</Typography>
              )}
            </List>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
}
