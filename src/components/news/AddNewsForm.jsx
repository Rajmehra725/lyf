import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Avatar,
} from "@mui/material";
import { FaUpload, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api/news";

const AddNewsForm = ({ token, newsId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch for editing
  useEffect(() => {
    if (newsId) {
      const load = async () => {
        try {
          const res = await axios.get(`${API}/${newsId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTitle(res.data.title);
          setDescription(res.data.description);
          setImagePreview(res.data.imageUrl);
        } catch (error) {
          console.log("Fetch failed", error);
        }
      };
      load();
    }
  }, [newsId, token]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (newsId) {
        await axios.put(`${API}/${newsId}`, formData, config);
      } else {
        await axios.post(API, formData, config);
      }

      setLoading(false);
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      onSuccess();
      alert("News saved successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Failed to upload!");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 650,
        mx: "auto",
        p: 2,
        mt: 4,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 3,
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, textAlign: "center", mb: 3 }}
        >
          {newsId ? "Update News" : "Add News"}
        </Typography>

        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              label="News Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          {/* Upload section */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: "2px dashed #9e9e9e",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <label style={{ cursor: "pointer" }}>
                <FaUpload size={30} style={{ marginBottom: 5 }} />
                <Typography>Upload Image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
              </label>
            </Box>
          </Grid>

          {/* Image preview */}
          {imagePreview && (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                variant="rounded"
                src={imagePreview}
                sx={{
                  width: "100%",
                  height: 250,
                  borderRadius: 3,
                  boxShadow: 3,
                  objectFit: "cover",
                }}
              />
            </Grid>
          )}

          {/* Submit button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.4,
                fontSize: "17px",
                fontWeight: "bold",
                borderRadius: "30px",
              }}
              onClick={handleSubmit}
              disabled={loading}
              startIcon={!loading && <FaCheckCircle />}
            >
              {loading ? (
                <CircularProgress size={26} color="inherit" />
              ) : newsId ? (
                "Update News"
              ) : (
                "Add News"
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddNewsForm;
