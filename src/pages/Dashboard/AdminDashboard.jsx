import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Tooltip,
} from "@mui/material";
import { FaTrash, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { MdClose, MdLogout } from "react-icons/md"; // 🔹 Logout Icon

const API_BASE = "https://raaznotes-backend.onrender.com/api/auth/users";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // 🔹 search state added

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users failed:", err);
      if (err.response) {
        setError(`Error: ${err.response.status} ${err.response.data.message || ""}`);
      } else if (err.request) {
        setError("No response from server. Check your backend.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError("");
    try {
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete user failed:", err);
      if (err.response) {
        setError(`Delete failed: ${err.response.status} ${err.response.data.message || ""}`);
      } else if (err.request) {
        setError("Delete failed: No response from server.");
      } else {
        setError(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleSave = async () => {
    setError("");
    try {
      if (editMode) {
        await axios.put(`${API_BASE}/users/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE}/users`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setOpen(false);
      setForm({ _id: "", name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      console.error("Save user failed:", err);
      if (err.response) {
        setError(`Save failed: ${err.response.status} ${err.response.data.message || ""}`);
      } else if (err.request) {
        setError("Save failed: No response from server.");
      } else {
        setError(`Save failed: ${err.message}`);
      }
    }
  };

  const openDialog = (user = null) => {
    if (user) {
      setEditMode(true);
      setForm({ ...user, password: "" });
    } else {
      setEditMode(false);
      setForm({ _id: "", name: "", email: "", password: "", role: "user" });
    }
    setOpen(true);
  };

  // 🔹 Filtered Users for Search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* 🔸 AppBar with Logout */}
      <AppBar position="static" sx={{ backgroundColor: "#ff6600" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard 👑
          </Typography>

          {/* Add User Button */}
          <Tooltip title="Add New User">
            <IconButton color="inherit" onClick={() => openDialog()}>
              <FaUserPlus />
            </IconButton>
          </Tooltip>

          {/* 🔹 Logout Button */}
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              <MdLogout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* 🔹 Error Message */}
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* 🔹 Summary Cards */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Card sx={{ flex: 1, minWidth: 200, textAlign: "center", p: 2, boxShadow: 3 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{users.length}</Typography>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200, textAlign: "center", p: 2, boxShadow: 3 }}>
            <Typography variant="h6">Admins</Typography>
            <Typography variant="h4">
              {users.filter((u) => u.role === "admin").length}
            </Typography>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200, textAlign: "center", p: 2, boxShadow: 3 }}>
            <Typography variant="h6">Normal Users</Typography>
            <Typography variant="h4">
              {users.filter((u) => u.role === "user").length}
            </Typography>
          </Card>
        </Box>

        {/* 🔹 Search Box */}
        <TextField
          label="Search by name or email"
          fullWidth
          sx={{ mb: 3 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🔹 Users List */}
        {loading ? (
          <Typography>Loading users...</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Registered Users ({filteredUsers.length})
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
              }}
            >
              {filteredUsers.map((u) => (
                <Card
                  key={u._id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{u.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: u.role === "admin" ? "goldenrod" : "gray",
                        fontWeight: "bold",
                      }}
                    >
                      {u.role === "admin" ? "👑 Admin" : "👤 User"}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => openDialog(u)}>
                        <FaUserEdit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(u._id)}>
                        <FaTrash />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Container>

      {/* 🔹 Add/Edit User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editMode ? "Edit User" : "Add User"}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <MdClose />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!editMode && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="user / admin"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#ff6600" }}
            onClick={handleSave}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
