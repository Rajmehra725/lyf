import React, { useEffect, useState } from "react";
import { getAlbum, downloadPhoto as downloadPhotoApi, downloadZip as downloadZipApi } from "../../api/albumAPI";

import {
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";

import { FiDownload } from "react-icons/fi";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const SingleAlbum = () => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const albumId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await getAlbum(albumId);
        setAlbum(res.data.album);
        setLoading(false);
      } catch (err) {
        console.error("Album Load Error:", err);
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  // Single photo download handler
  const handleDownloadPhoto = async (url) => {
    try {
      const data = await downloadPhotoApi(url); // returns blob
      const blob = new Blob([data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      const fileName = url.split("/").pop();
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Download Photo Error:", error);
    }
  };

  // Download all photos as ZIP
  const handleDownloadZip = async (photos) => {
    try {
      const data = await downloadZipApi(photos); // returns blob
      const blob = new Blob([data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "photos.zip";
      link.click();
    } catch (error) {
      console.error("Download ZIP Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  if (!album) {
    return (
      <h1 className="text-center text-red-500 text-2xl mt-10">
        Album Not Found!
      </h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <Card className="shadow-xl rounded-2xl mb-8">
        <CardContent className="text-center py-6">
          <Typography variant="h3" className="font-bold mb-2">
            📸 {album.name}
          </Typography>
          <Typography variant="body1" className="text-gray-600 mb-2">
            Total Photos: {album.photos.length}
          </Typography>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Button
              variant="contained"
              color="success"
              startIcon={<FiDownload />}
              onClick={() => handleDownloadZip(album.photos)}
            >
              Download All (ZIP)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {album.photos.map((photo, i) => (
          <div key={i} className="relative group">
            <img
              src={photo}
              alt="album"
              className="rounded-lg shadow-lg hover:scale-105 transition cursor-pointer"
              onClick={() => {
                setSelectedIndex(i);
                setLightboxOpen(true);
              }}
            />

            <Button
              variant="contained"
              size="small"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition"
              onClick={() => handleDownloadPhoto(photo)}
            >
              Download
            </Button>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        index={selectedIndex}
        close={() => setLightboxOpen(false)}
        slides={album.photos.map((url) => ({ src: url }))}
      />
    </div>
  );
};

export default SingleAlbum;
