// src/pages/AddUser.jsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddUser() {
  const [form, setForm] = useState({ name: "", age: "", city: "", state: "", pincode: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.name.trim()) return "Name is required";
    if (!/^\d+$/.test(String(form.age))) return "Age must be a number";
    if (!form.city.trim()) return "City is required";
    if (!form.state.trim()) return "State is required";
    if (form.pincode.length < 4) return "Pincode must be 4+ chars";
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    const v = validate(); if (v) { setError(v); return; }
    setSaving(true); setError("");
    try {
      await api.post("/api/users", {
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

  return (
    <Box component="form" onSubmit={submit}>
      <Typography variant="h4" gutterBottom>Add user</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField label="Name" name="name" value={form.name} onChange={onChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="Age" name="age" value={form.age} onChange={onChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="City" name="city" value={form.city} onChange={onChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="State" name="state" value={form.state} onChange={onChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="Pincode" name="pincode" value={form.pincode} onChange={onChange} fullWidth sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" disabled={saving}>Save</Button>
        <Button variant="outlined" onClick={() => navigate("/users")}>Cancel</Button>
      </Box>
    </Box>
  );
}
