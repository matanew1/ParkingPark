import React from "react";
import { Button, Grid, Typography, Paper, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MapIcon from '@mui/icons-material/Map';

export default function Profile() {
  const navigate = useNavigate();  
  const { logout, setError, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
        const logoutSuccess = await logout();
        if (logoutSuccess && !currentUser) {
            navigate("/"); 
        }
    } catch {
        setError("Failed to logout");
    }
  };

  const navigateToMap = () => {
    navigate("/profile/map");
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
          Profile
        </Typography>
        <Avatar style={{ margin: '0 auto', backgroundColor: '#3f51b5' }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography variant="h6" align="center" gutterBottom>
          Welcome {currentUser.email}
        </Typography>
        <Button
          startIcon={<MapIcon />}
          onClick={navigateToMap}
          variant="contained"
          color="primary"
          className="map-button"
          size="large"
          fullWidth
        >
          Go To Parking Map
        </Button>
        <Button
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          variant="contained"
          color="primary"
          className="logout-button"
          size="large"
          fullWidth
        >
          Logout
        </Button>
      </Paper>
    </Grid>
  );
}