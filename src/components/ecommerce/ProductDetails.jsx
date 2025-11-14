import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [text, setText] = useState("");
  const [star, setStar] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch product
  const fetchData = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  };

  // Add Comment
  const addComment = async () => {
    if (!text || !star) return alert("⭐ Rating + Comment required!");

    try {
      setLoading(true);
      await API.post(`/products/${id}/comment`, {
        rating: star,
        text,
      });

      setText("");
      setStar(0);
      fetchData();
    } catch (err) {
      console.error("❌ Add Comment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!product)
    return (
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={4}>
      {/* PRODUCT NAME */}
      <Typography variant="h4" fontWeight="bold">
        {product.name}
      </Typography>

      {/* PRICE */}
      <Typography variant="h6" color="green" mt={1}>
        ₹ {product.price}
      </Typography>

      {/* Avg Rating */}
      <Box mt={2}>
        <Rating value={product.avgRating || 0} readOnly size="large" />
        <Typography fontSize={14} color="gray">
          {product.avgRating?.toFixed(1) || "0.0"} / 5.0
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ADD COMMENT */}
      <Typography variant="h6">Add Your Rating & Review</Typography>

      <Rating
        value={star}
        onChange={(e, v) => setStar(v)}
        size="large"
        sx={{ mt: 1 }}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Write a comment…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button
        variant="contained"
        onClick={addComment}
        disabled={loading}
        sx={{ borderRadius: 2, px: 3 }}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>

      <Divider sx={{ my: 4 }} />

      {/* ALL COMMENTS */}
      <Typography variant="h5" fontWeight="bold">
        All Comments
      </Typography>

      {product.comments?.length === 0 && (
        <Typography mt={2} color="gray">
          No comments yet.
        </Typography>
      )}

      {product.comments?.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper elevation={3} sx={{ p: 2, my: 2 }}>
            <Rating value={c.rating} readOnly size="small" />

            <Typography mt={1}>{c.text}</Typography>

            <Typography fontSize={12} mt={1} color="gray">
              — {c.user?.name || "Anonymous"}
            </Typography>
          </Paper>
        </motion.div>
      ))}
    </Box>
  );
};

export default ProductDetails;
