'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import { FaSmile, FaSadTear, FaGrinStars, FaAngry, FaMeh, FaTrashAlt, FaHeart } from 'react-icons/fa';

const API_BASE = "https://raaznotes-backend.onrender.com/api/feelings";
 // aapka backend url

const moodMap = {
  happy: { icon: <FaSmile size={24} color="#FFD700" />, color: 'linear-gradient(120deg, #FFF176, #FFB74D)' },
  sad: { icon: <FaSadTear size={24} color="#1E90FF" />, color: 'linear-gradient(120deg, #90CAF9, #64B5F6)' },
  excited: { icon: <FaGrinStars size={24} color="#FF8C00" />, color: 'linear-gradient(120deg, #FFAB91, #FF7043)' },
  angry: { icon: <FaAngry size={24} color="#FF4500" />, color: 'linear-gradient(120deg, #EF5350, #E53935)' },
  neutral: { icon: <FaMeh size={24} color="#808080" />, color: 'linear-gradient(120deg, #EEEEEE, #BDBDBD)' },
};

export default function FeelingsPage() {
  const [feelings, setFeelings] = useState([]);
  const [feelingText, setFeelingText] = useState('');
  const [mood, setMood] = useState('neutral');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openMessage, setOpenMessage] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setOpenMessage(true);
  };

  // Fetch all feelings
  const fetchFeelings = async () => {
    try {
      const res = await axios.get(API_BASE);
      setFeelings(res.data);
    } catch (err) {
      showMessage('Feelings लोड करने में त्रुटि हुई!', 'error');
    }
  };

  useEffect(() => {
    fetchFeelings();
  }, []);

  // Add feeling
  const handleAddFeeling = async () => {
    if (!feelingText) return showMessage('Please enter your feeling!', 'error');
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/add`, { feelingText, mood });
      setFeelingText('');
      setMood('neutral');
      fetchFeelings();
      showMessage('Feeling सफलतापूर्वक जोड़ा गया!', 'success');
    } catch (err) {
      showMessage('Feeling जोड़ने में त्रुटि हुई!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete feeling
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${deleteId}`);
      setFeelings(feelings.filter(f => f._id !== deleteId));
      showMessage('Feeling सफलतापूर्वक हटाई गई!', 'success');
      setDeleteId(null);
    } catch (err) {
      showMessage('Feeling हटाने में त्रुटि हुई!', 'error');
    }
  };

  // Like feeling
  const handleLike = (id) => {
    setFeelings(feelings.map(f => f._id === id ? { ...f, likes: (f.likes || 0) + 1 } : f));
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" sx={{ color: '#ff6600', fontWeight: 700, textAlign: 'center', mb: 4 }}>
        ❤️ Live Your Life, Love Your Feelings
      </Typography>

      {/* Add Feeling Form */}
      <Box sx={{ p: 3, borderRadius: 3, boxShadow: '0 3px 15px rgba(0,0,0,0.1)', mb: 5, backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Share Your Feeling</Typography>
        <TextField
          label="Feeling"
          fullWidth
          value={feelingText}
          onChange={(e) => setFeelingText(e.target.value)}
          margin="normal"
        />
        <TextField
          select
          label="Mood"
          fullWidth
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          margin="normal"
          sx={{ mb: 2 }}
        >
          {Object.keys(moodMap).map((m) => (
            <MenuItem key={m} value={m}>{moodMap[m].icon} {m.charAt(0).toUpperCase() + m.slice(1)}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="warning" fullWidth onClick={handleAddFeeling} disabled={submitting} startIcon={<FaHeart />}>
          {submitting ? 'Adding...' : 'Add Feeling'}
        </Button>
      </Box>

      {/* Display Feelings */}
      {feelings.map(f => {
        const moodInfo = moodMap[f.mood] || moodMap.neutral;
        return (
          <Card key={f._id} sx={{ mb: 3, background: moodInfo.color, borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {moodInfo.icon} {f.mood.charAt(0).toUpperCase() + f.mood.slice(1)}
                </Typography>
                <IconButton color="error" onClick={() => setDeleteId(f._id)}><FaTrashAlt /></IconButton>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>{f.feelingText}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <IconButton color="secondary" onClick={() => handleLike(f._id)}><FaHeart /></IconButton>
                <Typography variant="caption">{f.likes || 0} Likes</Typography>
                <Typography variant="caption" sx={{ ml: 'auto' }}>{formatDate(f.createdAt)}</Typography>
              </Box>
            </CardContent>
          </Card>
        )
      })}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Are you sure you want to delete this feeling?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Messages Snackbar */}
      <Snackbar open={openMessage} autoHideDuration={3000} onClose={() => setOpenMessage(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={messageType} variant="filled" onClose={() => setOpenMessage(false)}>{message}</Alert>
      </Snackbar>
    </Container>
  );
}
