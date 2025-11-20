import React, { useEffect, useState } from "react";
import { getAllAlbums } from "../../api/albumAPI";

import QRCode from "react-qr-code";
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";

import { FiDownload, FiCheckCircle, FiImage, FiShare2 } from "react-icons/fi";

const PublicAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanned, setScanned] = useState({});

  const fetchAlbums = async () => {
    try {
      const res = await getAllAlbums();
      setAlbums(res.data.albums || []);
      setLoading(false);
    } catch (err) {
      console.error("Album Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        📸 Published Public Albums
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Card
            key={album.albumId}
            className="p-4 shadow-xl rounded-2xl hover:shadow-2xl transition"
          >
            <CardContent className="text-center">
              <Typography
                variant="h5"
                className="font-bold text-gray-800 mb-1"
                style={{ textTransform: "capitalize" }}
              >
                {album.name}
              </Typography>

              <Divider className="my-3" />

              <p className="text-gray-600 flex justify-center items-center gap-1 mb-2">
                <FiImage /> {album.photos?.length || 0} Photos
              </p>

              {/* QR Code */}
              <div className="bg-white p-3 inline-block rounded-xl shadow mb-3">
                <QRCode value={album.albumId} size={140} />
              </div>

              <Typography variant="body2" className="text-gray-600 mb-2">
                Scan this QR to unlock the album
              </Typography>

              {/* Scan Button */}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setScanned({ ...scanned, [album.albumId]: true })}
              >
                I Scanned the QR
              </Button>

              {scanned[album.albumId] && (
                <>
                  <div className="flex flex-col gap-2 mt-3">
                    <Button
                      fullWidth
                      color="success"
                      variant="contained"
                      startIcon={<FiDownload />}
                      onClick={() =>
                        (window.location.href = `/album/${album.albumId}`)
                      }
                    >
                      View / Download All
                    </Button>

                    <Button
                      fullWidth
                      color="primary"
                      variant="outlined"
                      startIcon={<FiShare2 />}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/album/${album.albumId}`
                        );
                        alert("Album link copied!");
                      }}
                    >
                      Share Album Link
                    </Button>

                    <p className="flex justify-center items-center gap-2 text-green-700">
                      <FiCheckCircle /> QR Verified
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PublicAlbums;
