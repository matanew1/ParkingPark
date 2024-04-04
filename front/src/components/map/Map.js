import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hidden, Box, Grid, Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { renderToString } from 'react-dom/server';
import "./Map.css"; // Import the CSS file
import { useLocation } from '../../contexts/LocationContext';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';


const PARKING_STATUS = {
    AVAILABLE: 'פנוי',
    FEW: 'מעט',
    FULL: 'מלא',
    CLOSED: 'סגור'
};

const ICON_CLASSES = {
    PRIMARY: 'my-icon-primary',
    SECONDARY: 'my-icon-secondary',
    DISABLED: 'my-icon-disabled',
    CLOSED: 'my-icon-closed',
};

const Map = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const { location, parkings } = useLocation();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (location) {
            const { latitude, longitude } = location;
            if (!mapRef.current) {
                initializeMap(mapRef, latitude, longitude);
            } 
            updateMarker(markerRef, mapRef, latitude, longitude);
        }
        if (parkings && mapRef.current) { // Add null check here
            createMarkersParking(parkings, mapRef);
        }
    }, [location, parkings]);

    return (
        <>
            <AppBar position="absolute" sx={{ 
                backdropFilter: "blur(5px)", 
                backgroundColor: "transparent", 
                width: "40%", // Set the width to 80% of the parent container
                marginLeft: "30%",
                marginRight: "30%" // Center the AppBar by setting the left margin to 10%
            }}>
                <Toolbar sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    color: 'black',
                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.9)',
                    borderRadius: "10px", // Add rounded borders

                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <IconButton color="black" aria-label="back" onClick={() => navigate('/profile/'+currentUser.reloadUserInfo.localId)} >
                            <ArrowBackIcon /> &nbsp;Back to profile
                        </IconButton>
                        <Hidden lgDown>
                            <IconButton color="black" aria-label="map">
                                <MapIcon /> &nbsp;Map Parking
                            </IconButton>
                        </Hidden>
                    </Box>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item xs={12}>
                    <Box
                        id="map"
                        sx={{
                            width: "100vw", // Full viewport width
                            height: "100vh", // Full viewport height
                            position: "absolute", // Make the map position absolute
                            top: 0, // Align the map to the top
                            left: 0, // Align the map to the left
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
};


const initializeMap = (mapRef, latitude, longitude) => {
    const mapOptions = {
        center: [latitude, longitude],
        zoom: 14,
    };

    mapRef.current = L.map("map", mapOptions);

    const layer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // Use HTTPS instead of HTTP
        {attribution: '© OpenStreetMap',  maxZoom: 18}
    );

    layer.addTo(mapRef.current);
}

const createMarkersParking = (parkings, mapRef) => {
    parkings.forEach(parking => {
        let iconClass;
        if (parking.Status === PARKING_STATUS.AVAILABLE) {
            iconClass = ICON_CLASSES.PRIMARY;
        } else if (parking.Status === PARKING_STATUS.FEW) {
            iconClass = ICON_CLASSES.SECONDARY;
        } else if (parking.Status === PARKING_STATUS.FULL){
            iconClass = ICON_CLASSES.DISABLED;
        } else if (parking.Status === PARKING_STATUS.CLOSED){
            iconClass = ICON_CLASSES.CLOSED;
        }

        const iconHtml = renderToString(<div className={iconClass}><LocationOnIcon color="primary" /></div>);
    
        const customIcon = L.divIcon({
            className: 'my-icon',
            html: iconHtml,
            iconSize: [30, 30],
        });
    
        const marker = L.marker([parking.GPSLattitude, parking.GPSLongitude], { icon: customIcon }).addTo(mapRef.current);

        // Add a click event to the marker
        marker.on('click', () => {
            const popupHtml = renderToString(
                <div>
                    <Typography variant="h4">Parking Status: {parking.Status}</Typography>
                    <Typography variant="h4">Location: {parking.GPSLattitude}, {parking.GPSLongitude}</Typography>
                    <Typography variant="h4">Parking Name: {parking.Name}</Typography>
                </div>
            );
            marker.bindPopup(popupHtml).openPopup();
        });
    });
}

const updateMarker = (markerRef, mapRef, latitude, longitude) => {
    const iconSvgHtml = renderToString(<div className="flashing-icon"><DirectionsCarFilledIcon color="primary" /></div>);
    const myIcon = L.divIcon({
        className: 'my-icon',
        html: iconSvgHtml,
        iconSize: [38, 38],
    });

    // Update the user's marker
    if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
    } else {
        markerRef.current = L.marker([latitude, longitude], {icon: myIcon}).addTo(mapRef.current);
    }

    markerRef.current.on('click', () => {
        markerRef.current.bindPopup(`<b>Location:</b> ${latitude}, ${longitude}`).openPopup();
    });
}


export default Map;
