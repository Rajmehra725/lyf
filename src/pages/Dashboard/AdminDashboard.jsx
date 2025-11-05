// AdminUsers.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  Switch,
} from "@mui/material";
import { motion } from "framer-motion";

// ✅ React Icons
import { FaTrash, FaSyncAlt, FaUserShield, FaBan } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, action: null, user: null });
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const showSnack = (message, severity = "success") =>
    setSnack({ open: true, severity, message });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/users`, { headers: authHeader });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
      showSnack(err?.response?.data?.message || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const performAction = async (action, user) => {
    setConfirm({ open: false, action: null, user: null });
    setActionLoadingId(user._id);
    try {
      if (action === "delete") {
        await axios.delete(`${API_BASE}/api/users/${user._id}`, { headers: authHeader });
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        showSnack("User deleted");
      } else if (action === "toggleRole") {
        const newRole = user.role === "admin" ? "user" : "admin";
        await axios.put(
          `${API_BASE}/api/users/${user._id}/role`,
          { role: newRole },
          { headers: authHeader }
        );
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
        );
        showSnack(`Role changed to ${newRole}`);
      } else if (action === "toggleBlock") {
        await axios.put(`${API_BASE}/api/users/${user._id}/block`, {}, { headers: authHeader });
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u))
        );
        showSnack(user.isBlocked ? "User unblocked" : "User blocked");
      }
    } catch (err) {
      console.error(`${action} error:`, err);
      showSnack(err?.response?.data?.message || "Action failed", "error");
      fetchUsers();
    } finally {
      setActionLoadingId(null);
    }
  };

  const openConfirm = (action, user) => setConfirm({ open: true, action, user });
  const closeConfirm = () => setConfirm({ open: false, action: null, user: null });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "80vh", bgcolor: "transparent" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Paper
          elevation={6}
          sx={{
            p: 2,
            borderRadius: 3,
            backdropFilter: "blur(8px)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            boxShadow:
              "0 8px 32px rgba(31, 38, 135, 0.12), inset 0 1px 0 rgba(255,255,255,0.02)",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <FaUserShield size={28} />
              <Box>
                <Typography variant="h6">Admin — Manage Users</Typography>
                <Typography variant="body2" color="text.secondary">
                  View, change role, block/unblock, or delete users.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              onClick={fetchUsers}
              startIcon={<MdOutlineRefresh />}
              size="small"
            >
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography>No users found</Typography>
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Blocked</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "table-row" }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={user.avatar || user.profilePicture || ""}>
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                          display: "inline-block",
                          bgcolor: user.role === "admin" ? "primary.main" : "grey.200",
                          color: user.role === "admin" ? "white" : "text.primary",
                          fontWeight: 600,
                        }}
                      >
                        {user.role}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Switch
                        checked={!!user.isBlocked}
                        onChange={() => openConfirm("toggleBlock", user)}
                        disabled={actionLoadingId === user._id}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Change Role">
                        <span>
                          <IconButton
                            onClick={() => openConfirm("toggleRole", user)}
                            disabled={actionLoadingId === user._id}
                            size="small"
                          >
                            {actionLoadingId === user._id ? (
                              <CircularProgress size={18} />
                            ) : (
                              <FaSyncAlt />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Delete User">
                        <span>
                          <IconButton
                            onClick={() => openConfirm("delete", user)}
                            disabled={actionLoadingId === user._id}
                            color="error"
                            size="small"
                          >
                            <FaTrash />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={user.isBlocked ? "Unblock User" : "Block User"}>
                        <span>
                          <IconButton
                            onClick={() => openConfirm("toggleBlock", user)}
                            disabled={actionLoadingId === user._id}
                            color={user.isBlocked ? "success" : "warning"}
                            size="small"
                          >
                            <FaBan />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </motion.div>

      {/* Confirm Dialog */}
      <Dialog open={confirm.open} onClose={closeConfirm}>
        <DialogTitle>
          {confirm.action === "delete" && `Delete user ${confirm.user?.name}?`}
          {confirm.action === "toggleRole" &&
            `Change role for ${confirm.user?.name} (current: ${confirm.user?.role})?`}
          {confirm.action === "toggleBlock" &&
            `${confirm.user?.isBlocked ? "Unblock" : "Block"} ${confirm.user?.name}?`}
        </DialogTitle>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button
            variant="contained"
            color={confirm.action === "delete" ? "error" : "primary"}
            onClick={() => performAction(confirm.action, confirm.user)}
            disabled={!!actionLoadingId}
          >
            {actionLoadingId ? <CircularProgress size={18} color="inherit" /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
