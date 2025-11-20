import axios from "axios";

const API = axios.create({
  baseURL: "https://raaznotes-backend.onrender.com/api/albums",
});

// 👉 Create album
export const createAlbum = (formData) =>
  API.post("/create", formData);

// 👉 Get all albums
export const getAllAlbums = () =>
  API.get("/");

// 👉 Get single album
export const getAlbum = (albumId) =>
  API.get(`/${albumId}`);  // FIXED

// 👉 Update album
export const updateAlbum = (albumId, formData) =>
  API.put(`/${albumId}`, formData);

// 👉 Delete album
export const deleteAlbum = (albumId) =>
  API.delete(`/${albumId}`);

// 👉 Download ZIP
// albumAPI.js
export const downloadZip = async (photos) => {
  try {
    const res = await API.post("/download-zip", { photos }, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "album.zip");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download ZIP Error:", err);
  }
};

 // Download single photo
// albumAPI.js
export const downloadPhoto = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", url.split("/").pop()); // filename from URL
  document.body.appendChild(link);
  link.click();
  link.remove();
};
