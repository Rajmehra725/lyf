// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

// 🔹 Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 🔹 Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Feelings from "./pages/Feelings";
import Safety from "./pages/Safety";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import NewsCard from "./components/news/NewsCard";
import NewsFeed from "./components/news/NewsFeed";
import ProductDetails from "./components/ecommerce/ProductDetails";
import PublicAlbum from "./components/photographer/PublicAlbum";
import AlbumView from "./components/photographer/AlbumView";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/feelings" element={<Feelings />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/products" element={<ProductDetails />} />
          <Route path="/album" element={<PublicAlbum />} />
          <Route path="/album/:albumId" element={<AlbumView />} />


           <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
            <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
