import axios from "axios";

const API = "https://raaznotes-backend.onrender.com/api/products";

export const getProducts = async () => {
  return await axios.get(API);
};

export const createProduct = async (formData) => {
  const token = localStorage.getItem("token");

  return await axios.post(
    "https://raaznotes-backend.onrender.com/api/products/create",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const updateProduct = async (id, formData) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
