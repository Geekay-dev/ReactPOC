// frontend/src/pages/EditUser.jsx
import React, { useEffect, useState } from "react";
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
  Backdrop,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    age: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true); // initial fetch
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing user id");
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await api.getUser(id);
        if (!mounted) return;
        setForm({
          name: data.name ?? "",
          age: data.age ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          pincode: data.pincode ?? "",
        });
      } catch (ex) {
        console.error("Failed to load user:", ex);
        setError(ex?.message || "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

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
          await api.updateUser(id, {
            id: Number(id),                     // <-- add this so route id and body id match
            name: form.name.trim(),
            age: Number(form.age),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
     });
      navigate("/users");
    } catch (ex) {
      console.error("Update failed:", ex);
      setError(ex?.response?.data?.message || ex?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "24px auto", px: 2 }}>
      <Card>
        <CardHeader title="Edit User" />
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
                  inputProps={{ maxLength: 100, tabIndex: 1 }}
                  autoFocus
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
                  size="medium"
                  aria-label="Save changes"
                  sx={{ minWidth: 120 }}
                >
                  {saving ? <CircularProgress size={20} /> : "Save"}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate("/users")}
                  disabled={saving}
                  size="medium"
                  aria-label="Cancel and go back to list"
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
        role="status"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      />
    </Box>
  );
}
