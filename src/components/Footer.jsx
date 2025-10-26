// src/components/Footer.jsx
import React from "react";
import { Box, Typography, Container, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        mt: "auto",
        py: 3,
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography variant="body1">
          &copy; {new Date().getFullYear()} LYF. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Made with ❤️ by Raaz Mehra |{" "}
          <Link
            href="https://github.com/Rajmehra725"
            target="_blank"
            rel="noopener"
            sx={{ color: "inherit", textDecoration: "underline" }}
          >
            GitHub
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
