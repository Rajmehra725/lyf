import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import ProductForm from "./ProductForm";
import { getProducts } from "../../api/productAPI";
import Slider from "react-slick";

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);

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

  // SLIDER SETTINGS
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

      {/* PRODUCT LIST */}
      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.18)",
                },
              }}
            >
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
              <CardContent sx={{ textAlign: "center", p: 2.5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, fontSize: 18 }}
                >
                  {p.name}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#d32f2f", mb: 0.8 }}
                >
                  ₹{p.price}
                </Typography>

                <Typography sx={{ fontSize: 14, color: "#555", mb: 0.5 }}>
                  {p.category}
                </Typography>

                <Typography sx={{ fontSize: 13, color: "gray" }}>
                  Stock: {p.stock}
                </Typography>
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
