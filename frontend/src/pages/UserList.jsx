// frontend/src/pages/UserList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../services/api";

export default function UserList() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setError("");
    setUsers(null);
    try {
      const data = await api.listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(String(e));
      setUsers([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (id) => setToDelete(id);

  const doDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deleteUser(toDelete);
      setToDelete(null);
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">Users</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/add"
          >
            Add user
          </Button>
          <Button
            variant="outlined"
            onClick={() => load()}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      <Paper>
        <TableContainer>
          {users === null ? (
            <Box display="flex" justifyContent="center" p={6}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box p={4}>
              <Typography color="error">Error: {error}</Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box p={4}>
              <Typography>No users yet. Click “Add user” to create one.</Typography>
            </Box>
          ) : (
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
                  <TableRow key={u.id} hover>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.age}</TableCell>
                    <TableCell>{u.city}</TableCell>
                    <TableCell>{u.state}</TableCell>
                    <TableCell>{u.pincode}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label={`edit-${u.id}`}
                          onClick={() => navigate(`/edit/${u.id}`)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          aria-label={`delete-${u.id}`}
                          onClick={() => confirmDelete(u.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)} disabled={deleting}>Cancel</Button>
          <Button color="error" onClick={doDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
