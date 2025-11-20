import React, { useEffect, useState } from "react";
import { getAlbum, downloadPhoto as downloadPhotoApi, downloadZip as downloadZipApi } from "../../api/albumAPI";
import {
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FiDownload } from "react-icons/fi";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const SingleAlbum = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const albumId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await getAlbum(albumId);
        setAlbum(res.data.album);
        setLoading(false);
      } catch (err) {
        console.error("Album Load Error:", err);
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  const handleDownloadPhoto = async (url) => {
    try {
      const data = await downloadPhotoApi(url);
      const blob = new Blob([data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      const fileName = url.split("/").pop();
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Download Photo Error:", error);
    }
  };

  const handleDownloadZip = async (photos, filename = "photos.zip") => {
    if (!photos.length) return;
    try {
      const data = await downloadZipApi(photos);
      const blob = new Blob([data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error("Download ZIP Error:", error);
    }
  };

  const toggleSelectPhoto = (photo) => {
    setSelectedPhotos((prev) =>
      prev.includes(photo)
        ? prev.filter((p) => p !== photo)
        : [...prev, photo]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === album.photos.length) {
      setSelectedPhotos([]); // deselect all
    } else {
      setSelectedPhotos([...album.photos]); // select all
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!album) {
    return (
      <Typography variant="h4" color="error" align="center" sx={{ mt: 5 }}>
        Album Not Found!
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 5 }, bgcolor: "#f5f5f5" }}>
      {/* Album Header */}
      <Card
        sx={{
          mb: 5,
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            📸 {album.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Photos: {album.photos.length}
          </Typography>

          {/* Header Buttons */}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FiDownload />}
              onClick={() => handleDownloadZip(album.photos, "all_photos.zip")}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              Download All
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<FiDownload />}
              onClick={() => handleDownloadZip(selectedPhotos, "selected_photos.zip")}
              disabled={selectedPhotos.length === 0}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
            >
              Download Selected ({selectedPhotos.length})
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={handleSelectAll}
              sx={{ borderColor: "white", color: "white" }}
            >
              {selectedPhotos.length === album.photos.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <Grid container spacing={3}>
        {album.photos.map((photo, i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover img": { transform: "scale(1.05)" },
                "&:hover .overlay": { opacity: 1 },
              }}
            >
              <img
                src={photo}
                alt={`Photo ${i + 1}`}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => {
                  setSelectedIndex(i);
                  setLightboxOpen(true);
                }}
              />

              {/* Overlay with single download & checkbox */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <Tooltip title="Download Single Photo">
                  <IconButton
                    onClick={() => handleDownloadPhoto(photo)}
                    sx={{ color: "white", bgcolor: "rgba(0,0,0,0.5)", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                  >
                    <FiDownload />
                  </IconButton>
                </Tooltip>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPhotos.includes(photo)}
                      onChange={() => toggleSelectPhoto(photo)}
                      sx={{ color: "white" }}
                    />
                  }
                  label="Select"
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        index={selectedIndex}
        close={() => setLightboxOpen(false)}
        slides={album.photos.map((url) => ({ src: url }))}
      />
    </Box>
  );
};

export default SingleAlbum;
