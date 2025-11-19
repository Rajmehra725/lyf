import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { FiX, FiUpload, FiTrash } from "react-icons/fi";
import { createProduct, updateProduct } from "../../api/productAPI";

const ProductForm = ({ open, handleClose, refresh, editData }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        price: editData.price,
        category: editData.category,
        stock: editData.stock,
        description: editData.description,
      });

      setExistingImages(editData.images || []);
      setPreviewImages([]);  // ★ Edit Mode reset
      setNewImages([]);      // ★ Edit Mode reset
    } else {
      setForm({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
      });

      setExistingImages([]);
      setNewImages([]);
      setPreviewImages([]);
    }
  }, [editData]);

  // ★★★★★ MULTIPLE IMAGE PREVIEW FIXED HERE ★★★★★
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...previews]); // <-- show all previews
  };

  const removeNewImage = (i) => {
    setNewImages(newImages.filter((_, index) => index !== i));
    setPreviewImages(previewImages.filter((_, index) => index !== i));
  };

  const removeExistingImage = (i) => {
    setExistingImages(existingImages.filter((_, index) => index !== i));
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("stock", form.stock);
      fd.append("description", form.description);

      existingImages.forEach((img) => fd.append("existingImages", img));
      newImages.forEach((file) => fd.append("images", file));

      if (editData) {
        await updateProduct(editData._id, fd);
      } else {
        await createProduct(fd);
      }

      refresh();
      handleClose();
    } catch (err) {
      console.log("PRODUCT SAVE ERROR:", err);
    }

    setSaving(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {editData ? "Edit Product" : "Add New Product"}
      </DialogTitle>

      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", right: 15, top: 15 }}
      >
        <FiX size={22} />
      </IconButton>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              startIcon={<FiUpload />}
              variant="outlined"
              component="label"
              sx={{ borderRadius: 3 }}
            >
              Upload Images
              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                {existingImages.map((img, i) => (
                  <Box key={i} sx={{ position: "relative" }}>
                    <img
                      src={img}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #ccc",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeExistingImage(i)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "white",
                        boxShadow: 1,
                      }}
                    >
                      <FiTrash size={15} color="#d32f2f" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* ★ NEW IMAGES PREVIEW FIXED */}
            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
              {previewImages.map((img, i) => (
                <Box key={i} sx={{ position: "relative" }}>
                  <img
                    src={img}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #ccc",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeNewImage(i)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "white",
                      boxShadow: 1,
                    }}
                  >
                    <FiTrash size={15} color="#d32f2f" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ px: 4, py: 1.2, borderRadius: 3 }}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : editData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
