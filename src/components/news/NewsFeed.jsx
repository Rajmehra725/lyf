import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import NewsCard from "./NewsCard";

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  const fetchNews = () => {
    axios
      .get("https://raaznotes-backend.onrender.com/api/news")
      .then((res) => setNews(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        Latest News
      </Typography>
      {news.map((item) => (
        <NewsCard key={item._id} news={item} onAction={fetchNews} />
      ))}
    </Box>
  );
};

export default NewsFeed;
