import React from "react";
import QRCode from "react-qr-code";

const QRCodeModal = ({ album, onClose }) => {
  const url = `https://lyf-fv59.onrender.com/album/${album._id}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="font-bold text-xl mb-4">QR Code – {album.name}</h2>

        <QRCode value={url} size={200} />

        <a
          href={url}
          download="album_qr.png"
          className="block mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Download QR
        </a>

        <button
          onClick={onClose}
          className="mt-3 bg-red-600 text-white py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
