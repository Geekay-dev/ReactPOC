// src/pages/UsersList.jsx
import React, { useEffect, useState } from "react";
import {
  Typography, Box, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function UserList() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await api.get("/api/users");
      setUsers(r.data);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      // optimistic: reload
      load();
    } catch (e) {
      alert("Delete failed");
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>Users</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => navigate("/add")}>Add user</Button>
      </Box>

      {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && users && users.length === 0 && (
        <Typography>No users yet. Create the first user.</Typography>
      )}

      {!loading && users && users.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Pincode</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.age}</TableCell>
                  <TableCell>{u.city}</TableCell>
                  <TableCell>{u.state}</TableCell>
                  <TableCell>{u.pincode}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton onClick={() => navigate(`/edit/${u.id}`)}><EditIcon/></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => remove(u.id)}><DeleteIcon/></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
