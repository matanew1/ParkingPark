import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import ErrorMessage from "./components/error/ErrorMessage";
import WithPrivateRoute from "./components/auth/WithPrivateRoute";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorMessage />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<WithPrivateRoute><Profile /></WithPrivateRoute>} />
          <Route path="/logout" element={<WithPrivateRoute><Logout /></WithPrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
