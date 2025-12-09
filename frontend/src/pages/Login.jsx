import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple mock auth just for UI flow
    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password are required.");
      return;
    }

    if (username === "admin" && password === "admin") {
      navigate("/users");
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 360 }}>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            User Directory Login
          </Typography>

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />

          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          <Button
            type="button"
            variant="contained"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
