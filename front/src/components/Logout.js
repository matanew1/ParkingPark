import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";
import Button from '@mui/material/Button';

const Logout = () => {
    const navigate = useNavigate();
  
    const { logout, setError, currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            setError("");
            const logoutSuccess = await logout();
            if (logoutSuccess && !currentUser) {
                navigate("/"); 
            } else {
                setError("Failed to logout");
            }
        } catch {
            setError("Failed to logout");
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;
