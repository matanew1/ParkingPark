import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, InputAdornment, Box, Paper, Typography, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            style={{ height: "100vh" }}
        >
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <Avatar style={{ margin: '0 auto', backgroundColor: '#3f51b5' }}>
                    <AccountCircleIcon />
                </Avatar>
                <form onSubmit={handleSubmit} style={{ width: '300px' }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}
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
                            fullWidth
                        >
                            Register
                        </Button>
                    </Grid>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Already have an account? 
                            <Link to="/login" style={{ textDecoration: 'none', color: '#3f51b5', marginLeft: '5px' }}>
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </Grid>
    );
};

export default Register;