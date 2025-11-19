import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import { FiEdit, FiTrash } from "react-icons/fi";
import Slider from "react-slick";

import ProductForm from "./ProductForm";
import { getProducts, deleteProduct } from "../../api/productAPI";

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // ⭐

  const loadProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products || data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setDeleteLoadingId(id); // ⭐ Start loading state

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.log(err);
    }

    setDeleteLoadingId(null); // ⭐ Stop loading
  };

  const handleEdit = (product) => {
    setEditData(product);
    setOpenForm(true);
  };

  // Slider Config
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {/* ADD PRODUCT BUTTON */}
      <Button
        variant="contained"
        sx={{
          mb: 3,
          px: 3,
          py: 1,
          fontWeight: 600,
          borderRadius: 3,
        }}
        onClick={() => {
          setEditData(null);
          setOpenForm(true);
        }}
      >
        + Add Product
      </Button>

      {/* PRODUCT GRID */}
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                transition: "0.3s",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.12)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.18)",
                },
                opacity: deleteLoadingId === p._id ? 0.5 : 1, // ⭐ blur visual
              }}
            >
              {/* DELETE LOADING OVERLAY */}
              {deleteLoadingId === p._id && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    zIndex: 20,
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
              )}

              {/* TOP BUTTONS */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 10,
                  display: "flex",
                  gap: 1,
                }}
              >
                <Tooltip title="Edit">
                  <span>
                    <IconButton
                      size="small"
                      disabled={deleteLoadingId === p._id} // ⭐ disabled while deleting
                      onClick={() => handleEdit(p)}
                      sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#e8e8e8" },
                      }}
                    >
                      <FiEdit size={18} color="#1976d2" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Delete">
                  <span>
                    <IconButton
                      size="small"
                      disabled={deleteLoadingId === p._id} // ⭐
                      onClick={() => handleDelete(p._id)}
                      sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#e8e8e8" },
                      }}
                    >
                      <FiTrash size={18} color="#d32f2f" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              {/* IMAGE SLIDER */}
              {p.images?.length > 0 && (
                <Slider {...settings}>
                  {p.images.map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={img}
                        alt="product"
                        style={{
                          width: "100%",
                          height: 220,
                          objectFit: "contain",
                          background: "#fafafa",
                          padding: "15px",
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              )}

              {/* PRODUCT DETAILS */}
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {p.name}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ color: "#d32f2f", fontWeight: "bold", my: 0.5 }}
                >
                  ₹{p.price}
                </Typography>

                <Typography sx={{ fontSize: 14, color: "gray" }}>
                  {p.category}
                </Typography>

                <Typography sx={{ fontSize: 13, mt: 1, color: "#555" }}>
                  Stock: {p.stock}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* PRODUCT FORM */}
      <ProductForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        refresh={loadProducts}
        editData={editData}
      />
    </>
  );
};

export default DashboardProducts;
