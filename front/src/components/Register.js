import React, { useState, useEffect  } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const { currentUser, register, setError } = useAuth();

    useEffect(() => {
        if (currentUser) {
          navigate("/");
        }
      }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            const registerSuccess = await register(email, password);
            if (registerSuccess) {
                navigate("/profile"); // navigate to /profile only when registration is successful
            } else {
                setError("Failed to register");
            }
        } catch (e) {
            setError("Failed to register");
        }

        setLoading(false);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
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
                <Grid item xs={12}>
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" disabled={loading} variant="contained" color="primary">
                        Register
                    </Button>
                </Grid>
                <Grid item xs={12}><br/>
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                        Already have an account? Login
                    </Link>
                </Grid>
            </form>
        </Grid>
    );
};

export default Register;
