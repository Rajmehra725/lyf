import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";

import Slider from "react-slick";
import ProductForm from "./ProductForm";
import { getProducts } from "../../api/productAPI";

import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingCart,
  FaFire,
  FaSearch,
} from "react-icons/fa";

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Load Products
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

  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Wishlist
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((i) => i !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  // Search + Sort logic
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <>

      {/* ===========================
           🔥 HEADER WITH BRAND NAME
      ============================ */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          sx={{
            fontSize: 40,
            fontWeight: 900,
            color: "#6a11cb",
            fontFamily: "cursive",
            textShadow: "2px 2px 8px rgba(0,0,0,0.15)",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          Stylish Zone
        </Typography>

        <Typography sx={{ mt: -1, color: "#555", letterSpacing: 1 }}>
          Premium Products • Best Prices • Fast Delivery
        </Typography>
      </Box>

      {/* ===========================
           🔍 SEARCH + SORT BAR
      ============================ */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <Box sx={{ position: "relative", flexGrow: 1 }}>
          <FaSearch
            style={{
              position: "absolute",
              top: "13px",
              left: "12px",
              color: "#777",
            }}
          />
          <TextField
            fullWidth
            placeholder="Search products..."
            sx={{ pl: 4 }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* Sort */}
        <TextField
          select
          label="Sort by"
          sx={{ width: 180 }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="low-high">Price: Low to High</MenuItem>
          <MenuItem value="high-low">Price: High to Low</MenuItem>
        </TextField>
      </Box>

      {/* ===========================
          PRODUCT GRID
      ============================ */}
      <Grid container spacing={3}>
        {filteredProducts.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                transition: "0.3s",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.20)",
                },
              }}
            >
              {/* Wishlist Icon */}
              <IconButton
                onClick={() => toggleWishlist(p._id)}
                sx={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
              >
                {wishlist.includes(p._id) ? (
                  <FaHeart color="red" size={22} />
                ) : (
                  <FaRegHeart size={22} />
                )}
              </IconButton>

              {/* NEW Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  background: "#ff5722",
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                NEW
              </Box>

              {/* IMAGE SLIDER */}
              <Box sx={{ background: "#f7f7f7" }}>
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
                            padding: "15px",
                          }}
                        />
                      </div>
                    ))}
                  </Slider>
                )}
              </Box>

              {/* PRODUCT DETAILS */}
              <CardContent sx={{ textAlign: "left", p: 2.2 }}>
                {/* Title */}
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: 17,
                    lineHeight: "20px",
                    height: "40px",
                    overflow: "hidden",
                  }}
                >
                  {p.name}
                </Typography>

                {/* Price + Offer */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, color: "#d32f2f", mb: 1 }}
                >
                  ₹{p.price}  
                  <span style={{ color: "green", fontSize: 14 }}>  • 42% OFF</span>
                </Typography>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <FaStar color="#ffa41c" />
                  <Typography sx={{ ml: 0.6, fontWeight: 600 }}>
                    {p.rating || 4.3}
                  </Typography>
                  <Typography sx={{ ml: 1, fontSize: 13, color: "gray" }}>
                    ({p.reviews || 120} reviews)
                  </Typography>
                </Box>

                {/* Free Delivery */}
                <Typography
                  sx={{
                    mt: 0.3,
                    color: "#4caf50",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  ✔ Free Delivery Available
                </Typography>

                {/* Category */}
                <Typography sx={{ fontSize: 13, color: "#555", mt: 1 }}>
                  {p.category}
                </Typography>

                {/* Stock */}
                <Typography sx={{ fontSize: 13, color: "gray" }}>
                  Stock: {p.stock}
                </Typography>

                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    View Details
                  </Button>

                  <IconButton sx={{ bgcolor: "#f3f3f3" }}>
                    <FaShoppingCart />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* FORM DIALOG */}
      <ProductForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        refresh={loadProducts}
      />
    </>
  );
};

export default DashboardProducts;
