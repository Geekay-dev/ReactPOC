// frontend/src/pages/AddUser.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
//import axios from "../services/api"; // adapt if your axios instance path differs
//- import axios from "../services/api"; // adapt if your axios instance path differs
 import { api } from "../services/api";

export default function AddUser() {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ui state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // simple field-level validation rules
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) <= 0) return "Age must be a positive number";
    if (!form.city.trim()) return "City is required";
    if (!form.state.trim()) return "State is required";
    if (!/^\d{6}$/.test(form.pincode)) return "Pincode must be 6 digits";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    setError("");
    try {
      // adapt endpoint if your API base differs
          await api.createUser({
            name: form.name.trim(),
            age: Number(form.age),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
          });

      // on success, navigate back to list
      navigate("/users");
    } catch (ex) {
      console.error("Add user failed:", ex);
      setError(
        ex?.response?.data?.message ||
        ex?.message ||
        "Failed to create user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "24px auto", px: 2 }}>
      <Card>
        <CardHeader title="Add User" />
        <CardContent>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ inputMode: "numeric", maxLength: 6 }}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : "Create"}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate("/users")}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </Box>
  );
}
