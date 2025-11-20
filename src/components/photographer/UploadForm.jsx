import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

import { FiUpload, FiImage } from "react-icons/fi";

const UploadForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);

    setUploaded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setUploaded(false);

    const formData = new FormData();
    formData.append("name", name);

    photos.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      await onSubmit(formData); // backend call
      setUploaded(true);

      // Reset after upload
      setName("");
      setPhotos([]);
      setPreview([]);

    } catch (err) {
      console.error("Upload failed", err);
    }

    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "white",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Create New Album
      </Typography>

      {/* Upload Success Message */}
      {uploaded && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Album Uploaded Successfully! 🎉
        </Alert>
      )}

      {/* Album Name */}
      <TextField
        fullWidth
        label="Album Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* File Upload */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<FiUpload />}
        sx={{ mb: 2 }}
      >
        Upload Photos
        <input type="file" multiple hidden onChange={handlePhotoChange} />
      </Button>

      {/* Preview Grid */}
      {preview.length > 0 && (
        <>
          <Typography variant="h6" mt={2} mb={1}>
            Preview Photos
          </Typography>
          <Grid container spacing={2}>
            {preview.map((src, index) => (
              <Grid item xs={4} key={index}>
                <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={src}
                    alt="preview"
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption">
                      Photo {index + 1}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 3,
          py: 1.4,
          fontSize: "1rem",
          borderRadius: 2,
          position: "relative",
        }}
        startIcon={!loading && <FiImage />}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Create Album"
        )}
      </Button>
    </Box>
  );
};

export default UploadForm;
