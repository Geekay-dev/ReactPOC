// src/pages/EditUser.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditUser() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await api.get(`/api/users/${id}`);
        if (!cancel) setForm(r.data);
      } catch (e) {
        setError("Failed to load user");
      }
    })();
    return () => { cancel = true; };
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/users/${id}`, {
        name: form.name,
        age: parseInt(form.age, 10),
        city: form.city,
        state: form.state,
        pincode: form.pincode
      });
      navigate("/users");
    } catch (e) {
      setError("Save failed");
    } finally { setSaving(false); }
  }

  if (!form) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress/></Box>;

  return (
    <Box component="form" onSubmit={submit}>
      <Typography variant="h4" gutterBottom>Edit user</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth sx={{ mb: 2 }} />
      <TextField label="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} fullWidth sx={{ mb: 2 }} />
      <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} fullWidth sx={{ mb: 2 }} />
      <TextField label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} fullWidth sx={{ mb: 2 }} />
      <TextField label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} fullWidth sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" disabled={saving}>Save</Button>
        <Button variant="outlined" onClick={() => navigate("/users")}>Cancel</Button>
      </Box>
    </Box>
  );
}
