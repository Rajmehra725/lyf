import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const PhotoGrid = ({ album }) => {
  const [preview, setPreview] = useState(null);

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-4 tracking-wide">
        {album.name} – Photos
      </h2>

      {/* ---------------------- Photo Grid ---------------------- */}
      <div
        className="
          grid grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          gap-3
        "
      >
        {album.photos.map((photo, index) => (
          <div
            key={index}
            onClick={() => setPreview(photo)}
            className="
              cursor-pointer
              relative
              rounded-xl
              overflow-hidden
              shadow-lg
              group
              transition-all 
              duration-300 
              hover:scale-[1.02]
              hover:shadow-2xl
            "
          >
            <img
              src={photo}
              alt="album-photo"
              className="
                w-full h-40 object-cover
                transition-transform duration-500 
                group-hover:scale-110
              "
            />

            {/* Overlay on hover */}
            <div
              className="
                absolute inset-0 bg-black/40 
                opacity-0 group-hover:opacity-100 
                flex items-center justify-center 
                text-white text-lg 
                transition-opacity duration-300
              "
            >
              Tap to view
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------- Full Screen Preview ---------------------- */}
      {preview && (
        <div
          className="
            fixed inset-0 
            bg-black/70 
            backdrop-blur-sm
            flex items-center justify-center 
            z-50 
            animate-fadeIn
          "
        >
          {/* Close Button */}
          <button
            onClick={() => setPreview(null)}
            className="
              absolute top-6 right-6 
              bg-red-600 hover:bg-red-700 
              text-white p-3 
              rounded-full shadow-lg 
              transition-all duration-300
            "
          >
            <FaTimes size={22} />
          </button>

          {/* Image */}
          <img
            src={preview}
            alt="preview"
            className="
              max-w-[92%] 
              max-h-[90vh] 
              rounded-xl 
              shadow-2xl 
              border border-white/10
              animate-zoomIn
            "
          />
        </div>
      )}

      {/* ---------- Animation Classes ---------- */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes zoomIn {
            from {
              transform: scale(0.7);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-fadeIn { animation: fadeIn 0.3s ease; }
          .animate-zoomIn { animation: zoomIn 0.3s ease; }
        `}
      </style>
    </div>
  );
};

export default PhotoGrid;
