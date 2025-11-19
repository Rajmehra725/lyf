import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from "react-icons/fa";

const API = "http://localhost:5000/api/products"; // CHANGE LATER

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Delete Product
  const deleteProduct = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      navigate("/dashboard/products");
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!product)
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="error">
          Product Not Found
        </Typography>
      </Box>
    );

  const images = product.images || [];

  return (
    <Box p={3}>
      {/* -------- Breadcrumb -------- */}
      <Typography variant="body2" sx={{ mb: 2, cursor: "pointer" }} onClick={() => navigate(-1)}>
        ← Back
      </Typography>

      <Grid container spacing={4}>
        {/* -------- Left Images Section -------- */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardMedia
              component="img"
              sx={{
                height: 380,
                objectFit: "contain",
                background: "#f5f5f5",
              }}
              src={images[imageIndex]}
              alt="product"
            />
          </Card>

          {/* --- Carousel Controls --- */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <IconButton onClick={() => setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}>
              <FaChevronLeft />
            </IconButton>

            <IconButton
              onClick={() =>
                setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
              }
            >
              <FaChevronRight />
            </IconButton>
          </Box>

          {/* --- Thumbnail Row --- */}
          <Box display="flex" mt={2} overflow="auto" gap={1}>
            {images.map((img, i) => (
              <Card
                key={i}
                onClick={() => setImageIndex(i)}
                sx={{
                  width: 70,
                  height: 70,
                  border: imageIndex === i ? "2px solid #1976d2" : "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                <CardMedia
                  component="img"
                  src={img}
                  sx={{ height: "100%", objectFit: "cover" }}
                />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* -------- Right Product Info -------- */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" fontWeight={700} mb={2}>
            {product.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            {product.description}
          </Typography>

          <Typography variant="h5" color="green" fontWeight={600} mb={4}>
            ₹ {product.price}
          </Typography>

          {/* Action Buttons */}
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              sx={{ borderRadius: 20, px: 4 }}
              onClick={() => alert("Added to cart")}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<FaEdit />}
              onClick={() => navigate(`/dashboard/edit-product/${id}`)}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<FaTrash />}
              onClick={deleteProduct}
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
