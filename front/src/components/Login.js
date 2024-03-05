import React, { useState, useEffect } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PersonIcon from '@mui/icons-material/Person';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, login, setError } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        navigate("/profile"); // navigate to /profile only when login is successful
      } else {
        setError("Failed to login");
      }
    } catch (e) {
      setError("Failed to login");
    }

    setLoading(false);
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      style={{ height: "100vh" }}
    >
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <Grid item xs={12}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item>
          <Button
            startIcon={<PersonIcon />}
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            className="register-button"
            size="large"
          >
            Login
          </Button>
        </Grid><br/>
        <Link to="/register">
          Don't have an account? Register
        </Link>
      </form>
    </Grid>
  );
};

export default Login;