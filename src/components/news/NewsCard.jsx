import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  TextField,
  Chip,
  Collapse,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "axios";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const API = "https://raaznotes-backend.onrender.com/api/news";

const NewsCard = ({ news, onAction }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // ✅ Actions
  const handleLike = async () => {
    try {
      setLoadingAction(true);
      await axios.put(`${API}/${news._id}/like`);
      onAction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      setLoadingAction(true);
      await axios.post(`${API}/${news._id}/comment`, { comment });
      setComment("");
      onAction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleShare = async () => {
    try {
      setLoadingAction(true);
      await axios.put(`${API}/${news._id}/share`);
      navigator.clipboard.writeText(`https://raaznotes-frontend.com/news/${news._id}`);
      alert("News link copied!");
      onAction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Author + Timestamp */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 1 }}>
        <Avatar
          src={news.author?.avatar || ""}
          alt={news.author?.name || "A"}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {news.author?.name || "Anonymous"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })}
          </Typography>
        </Box>
      </Box>

      {/* Image / Media */}
      {news.imageUrl && (
        <Box
          sx={{
            width: "100%",
            maxHeight: 400,
            bgcolor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={news.imageUrl}
            alt={news.title}
            sx={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      <CardContent>
        {/* Title + Category/Tags */}
        <Typography variant="h6" fontWeight="bold">
          {news.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          {news.category && <Chip label={news.category} size="small" color="primary" />}
          {news.tags?.map((tag, i) => (
            <Chip key={i} label={`#${tag}`} size="small" variant="outlined" />
          ))}
        </Stack>

        {/* Description */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          {news.description}
        </Typography>

        {/* Location */}
        {news.location && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            📍 {news.location}
          </Typography>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            size="small"
            startIcon={<FaThumbsUp />}
            onClick={handleLike}
            disabled={loadingAction}
          >
            {news.likes?.length || 0} Like
          </Button>
          <Button
            size="small"
            startIcon={<FaComment />}
            onClick={() => setShowComments(!showComments)}
          >
            {news.comments?.length || 0} Comment
          </Button>
          <Button
            size="small"
            startIcon={<FaShare />}
            onClick={handleShare}
            disabled={loadingAction}
          >
            {news.shareCount || 0} Share
          </Button>
        </Box>

        {/* Comments */}
        <Collapse in={showComments}>
          <Box sx={{ mt: 2 }}>
            {news.comments?.map((c, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <b>{c.user?.name || "Anonymous"}:</b> {c.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
            ))}

            {/* Add Comment */}
            <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment}
                disabled={loadingAction || !comment.trim()}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
