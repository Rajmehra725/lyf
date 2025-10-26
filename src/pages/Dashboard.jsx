// src/pages/Dashboard/Dashboard.jsx
import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from "@mui/material";
import { FaHeart, FaShieldAlt, FaCloudUploadAlt } from "react-icons/fa";

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Welcome to your Dashboard 💖
      </Typography>

      <Grid container spacing={4}>
        {/* Feelings Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <FaHeart size={40} color="#e91e63" />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Feelings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Express your feelings and track your emotions daily.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Go to Feelings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Safety Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <FaShieldAlt size={40} color="#1976d2" />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Safety
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Protect your mind, body and digital space.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Go to Safety
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
            <FaCloudUploadAlt size={40} color="#4caf50" />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Upload
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your memories safely via Cloudinary.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Go to Upload
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
