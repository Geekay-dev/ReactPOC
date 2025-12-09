// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("user_name");
  const loggedIn = !!localStorage.getItem("user_token");

  function logout() {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    navigate("/login");
  }

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>
          User Directory
        </Typography>

        {loggedIn ? (
          <>
            <Typography sx={{ mr: 2 }}>{name}</Typography>
            <Button color="inherit" onClick={() => navigate("/users")}>Users</Button>
            <Button color="inherit" onClick={() => navigate("/add")}>Add user</Button>
            <Button color="inherit" onClick={logout}>Log out</Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>Log in</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <>
      <TopBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/add" element={<AddUser />} />
          <Route path="/edit/:id" element={<EditUser />} />
        </Routes>
      </Container>
    </>
  );
}
