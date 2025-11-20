import React, { useState, useEffect } from "react";
import {
  createAlbum,
  getAllAlbums,
  deleteAlbum,
} from "../../api/albumAPI";

import UploadForm from "./UploadForm";
import AlbumCard from "./AlbumCard";
import PhotoGrid from "./PhotoGrid";
import QRCodeModal from "./QRCodeModal";

import CircularProgress from "@mui/material/CircularProgress";
import { Snackbar, Alert } from "@mui/material";

const PhotographerDashboard = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [qrAlbum, setQrAlbum] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // -------------------------------
  // Fetch All Albums
  // -------------------------------
  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await getAllAlbums();
      setAlbums(res.data.albums || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error loading albums:", err);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  // -------------------------------
  // Create Album
  // -------------------------------
  const handleCreate = async (formData) => {
    try {
      setCreating(true);

      const res = await createAlbum(formData);

      setToast({
        open: true,
        message: `Album created successfully!`,
        severity: "success",
      });

      fetchAlbums();
      setCreating(false);
    } catch (err) {
      setCreating(false);
      setToast({
        open: true,
        message: "Error creating album!",
        severity: "error",
      });
    }
  };

  // -------------------------------
  // Delete Album
  // -------------------------------
  const handleDelete = async (albumId) => {
    if (window.confirm("Delete this album permanently?")) {
      await deleteAlbum(albumId);
      fetchAlbums();

      setToast({
        open: true,
        message: "Album deleted",
        severity: "info",
      });
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 drop-shadow-sm">
          📸 Photographer Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Upload albums, manage photos, and share QR codes instantly.
        </p>
      </div>

      {/* Upload Form Section */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create New Album
        </h2>
        <UploadForm onSubmit={handleCreate} loading={creating} />
      </div>

      {/* Album List */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-800">
        Your Albums
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : albums.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No albums yet. Upload your first album!
        </p>
      ) : (
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          xl:grid-cols-4 
          gap-6
        ">
          {albums.map((album) => (
            <AlbumCard
              key={album.albumId}
              album={album}
              onDelete={() => handleDelete(album.albumId)}
              onView={() => setSelectedAlbum(album)}
              onQr={() => setQrAlbum(album)}
            />
          ))}
        </div>
      )}

      {/* View Album Photos */}
      {selectedAlbum && (
        <div className="mt-10 p-4 border rounded-xl shadow-xl bg-white text-black max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedAlbum(null)}
            className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-red-700"
          >
            Close Album
          </button>

          <PhotoGrid album={selectedAlbum} />
        </div>
      )}

      {/* QR Code Modal */}
      {qrAlbum && <QRCodeModal album={qrAlbum} onClose={() => setQrAlbum(null)} />}

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PhotographerDashboard;
