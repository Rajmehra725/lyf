import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider
} from "@mui/material";
import API from "../../api/axiosInstance";
import ProductForm from "../../components/ecommerce/ProductForm";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        🛒 Product Dashboard (CRUD)
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => {
          setEditItem(null);
          setOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        + Add New Product
      </Button>

      <Divider />

      <Grid container spacing={3} mt={1}>
        {products.length === 0 && (
          <Typography mt={3} ml={1}>
            No products found. Add new products to get started.
          </Typography>
        )}

        {products.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              {item.image && (
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image}
                  alt="Product Image"
                />
              )}

              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description?.substring(0, 80)}...
                </Typography>

                <Typography variant="h6" color="primary" mt={1}>
                  ₹ {item.price}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditItem(item);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Product Form Modal */}
      <ProductForm
        open={open}
        setOpen={setOpen}
        editItem={editItem}
        refresh={fetchProducts}
      />
    </Box>
  );
};

export default Dashboard;
