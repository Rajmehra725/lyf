import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography
} from "@mui/material";
import API from "../../api/axiosInstance";

const ProductForm = ({ open, setOpen, editItem, refresh }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const [preview, setPreview] = useState("");

  // Load existing product in form when editing
  useEffect(() => {
    if (editItem) {
      setForm(editItem);
      setPreview(editItem.image);
    } else {
      setForm({ name: "", price: "", description: "", image: "" });
      setPreview("");
    }
  }, [editItem]);

  // Image Handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    const res = await API.post("/upload", formData);
    setForm({ ...form, image: res.data.url });
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      alert("Name and Price are required!");
      return;
    }

    try {
      if (editItem) {
        await API.put(`/products/${editItem._id}`, form);
      } else {
        await API.post("/products", form);
      }
      refresh();
      setOpen(false);
    } catch (err) {
      console.log("Submit Error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>
        {editItem ? "Edit Product" : "Add New Product"}
      </DialogTitle>

      <DialogContent>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Product Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Price"
            fullWidth
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          {preview && (
            <Box mt={1}>
              <Typography fontWeight="bold">Preview:</Typography>
              <img
                src={preview}
                alt="Preview"
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {editItem ? "Update Product" : "Create Product"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
