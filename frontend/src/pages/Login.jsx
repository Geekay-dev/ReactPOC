import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

export default function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    localStorage.setItem("username", name);
    navigate("/users");
  }

  function handleClear() {
    setName("");
    setError("");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        padding: 2,
      }}
    >
      <Card sx={{ width: 420, padding: 2, backgroundColor: "#1e1e1e" }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
            Login Page
          </Typography>

          <Typography variant="body2" color="gray" mb={2}>
            Enter your name to continue to the User Directory.
          </Typography>

          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              input: { color: "white" },
              label: { color: "gray" },
              mb: 2,
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleLogin}>
              Log In
            </Button>

            <Button variant="outlined" color="warning" onClick={handleClear}>
              Clear
            </Button>
          </Box>

          <Typography variant="caption" color="gray" display="block" mt={2}>
            Demo only — no backend authentication.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
