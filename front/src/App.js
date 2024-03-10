import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ErrorMessage from "./components/error/ErrorMessage";
import WithPrivateRoute from "./components/auth/WithPrivateRoute";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: {
          backgroundImage: 'linear-gradient(45deg, #e66465 30%, #9198e5 90%)',
        },
      }}/>
      <AuthProvider>
        <Router>
          <ErrorMessage />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<WithPrivateRoute><Profile /></WithPrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}