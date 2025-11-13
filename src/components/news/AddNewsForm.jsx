import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api/news";

const AddNewsForm = ({ token, newsId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (newsId) {
      axios.get(API).then(res => {
        const news = res.data.find(n => n._id === newsId);
        if (news) {
          setTitle(news.title);
          setDescription(news.description);
          setLocation(news.location || "");
          setCategory(news.category || "");
          setTags(news.tags?.join(", ") || "");
          setPreview(news.imageUrl || "");
        }
      });
    }
  }, [newsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      return alert("Title and description are required!");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("tags", tags);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (!token) return alert("You must be logged in to post news!");

      if (newsId) {
        await axios.put(`${API}/${newsId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess?.();
      setTitle(""); setDescription(""); setLocation(""); setCategory(""); setTags(""); setImageFile(null); setPreview("");
    } catch (err) {
      console.error("CREATE NEWS FRONTEND ERROR:", err.response?.data || err);
      alert("Error saving news: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box p={2} border="1px solid #ddd" borderRadius={2} mb={2}>
      <Typography variant="h6">{newsId ? "Edit News" : "Add News"}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} margin="normal" required />
        <TextField fullWidth label="Description" value={description} onChange={e => setDescription(e.target.value)} margin="normal" multiline rows={3} required />
        <TextField fullWidth label="Location" value={location} onChange={e => setLocation(e.target.value)} margin="normal" />
        <TextField fullWidth label="Category" value={category} onChange={e => setCategory(e.target.value)} margin="normal" />
        <TextField fullWidth label="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} margin="normal" />
        <input type="file" onChange={e => { setImageFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} style={{ marginTop: 10 }} />
        {preview && <img src={preview} alt="preview" style={{ width: "100%", marginTop: 10, borderRadius: 10 }} />}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>{newsId ? "Update News" : "Add News"}</Button>
      </form>
    </Box>
  );
};

export default AddNewsForm;
