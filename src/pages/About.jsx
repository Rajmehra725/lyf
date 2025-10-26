import React from "react";
import { Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container sx={{ pt: 6 }}>
      <Typography variant="h4">About LYF</Typography>
      <Typography>
        LYF means “Love Your Feelings” and “Live Your Life.” This is your journey of emotions and growth.
      </Typography>
    </Container>
  );
}
