import React from "react";
import { FaTrash, FaEye, FaQrcode } from "react-icons/fa";
import { Card, CardContent, CardMedia, Button } from "@mui/material";

const AlbumCard = ({ album, onDelete, onView, onQr }) => {
  return (
    <Card
      className="
        bg-white/70 
        backdrop-blur-xl 
        shadow-xl 
        rounded-2xl 
        overflow-hidden 
        transform 
        transition 
        duration-300 
        hover:-translate-y-2 
        hover:shadow-2xl
      "
    >
      {/* Thumbnail */}
      <CardMedia
        component="img"
        height="170"
        image={album.photos[0]}
        alt="Album"
        className="object-cover"
      />

      <CardContent className="text-black">
        <h2 className="text-xl font-bold tracking-wide">{album.name}</h2>

        <p className="text-gray-600 text-sm mt-1">
          {album.photos.length} Photos
        </p>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={onView}
            className="!flex !gap-2 !normal-case !text-white !rounded-lg !px-4 !py-2"
          >
            <FaEye /> View
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={onQr}
            className="!flex !gap-2 !normal-case !text-white !rounded-lg !px-4 !py-2"
          >
            <FaQrcode /> QR
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            className="!flex !gap-2 !normal-case !text-white !rounded-lg !px-4 !py-2"
          >
            <FaTrash /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
