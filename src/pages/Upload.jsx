import React from "react";
import { Container, Typography } from "@mui/material";

export default function Upload() {
  return (
    <Container sx={{ pt: 6 }}>
      <Typography variant="h4">Upload Zone</Typography>
      <Typography>Here you’ll upload memories or moments via Cloudinary.</Typography>
    </Container>
  );
}
