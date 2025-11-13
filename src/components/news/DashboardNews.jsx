import React, { useState, useEffect } from "react";
import axios from "axios";
import AddNewsForm from "./AddNewsForm";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";

const API = "https://raaznotes-backend.onrender.com/api/news";

export default function Dashboard() {
  const [newsList, setNewsList] = useState([]);
  const [editNewsId, setEditNewsId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setNewsList(res.data);
    } catch (err) {
      console.error("Fetch news error:", err);
      setError(err.response?.data?.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ✅ Delete news (only author can delete)
  const handleDelete = async (id, authorId) => {
    if (!token) return setError("You must be logged in to delete news");

    const userId = JSON.parse(atob(token.split(".")[1])).id;
    if (userId !== authorId) {
      return setError("You can only delete your own news!");
    }

    if (!window.confirm("Are you sure you want to delete this news?")) return;

    try {
      setDeleteLoadingId(id);
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
    } catch (err) {
      console.error("Delete error:", err.response || err);
      setError(err.response?.data?.message || "Failed to delete news");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Dashboard
      </Typography>

      {/* Add / Edit News Form */}
      <AddNewsForm
        token={token}
        newsId={editNewsId}
        onSuccess={() => {
          setEditNewsId(null);
          fetchNews();
        }}
      />

      {/* Loading spinner */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {newsList.map((news) => (
            <Grid item xs={12} sm={6} md={4} key={news._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  height: "100%",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {news.title}
                  </Typography>
                  {news.imageUrl && (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        marginTop: 5,
                        objectFit: "cover",
                        maxHeight: 200,
                      }}
                    />
                  )}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {news.description}
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                    Author: {news.author?.name || "Unknown"}
                  </Typography>
                  {news.location && (
                    <Typography variant="caption" sx={{ display: "block" }}>
                      Location: {news.location}
                    </Typography>
                  )}
                  {news.category && (
                    <Typography variant="caption" sx={{ display: "block" }}>
                      Category: {news.category}
                    </Typography>
                  )}
                  {news.tags?.length > 0 && (
                    <Typography variant="caption" sx={{ display: "block" }}>
                      Tags: {news.tags.join(", ")}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setEditNewsId(news._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    disabled={deleteLoadingId === news._id}
                    onClick={() => handleDelete(news._id, news.author._id)}
                  >
                    {deleteLoadingId === news._id ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
