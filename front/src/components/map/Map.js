import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Grid, Typography } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { renderToString } from 'react-dom/server';
import "./Map.css"; // Import the CSS file
import { useLocation } from '../../contexts/LocationContext';

const Map = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const {location, parkings } = useLocation();

    useEffect(() => {
        if (location) {
            const { latitude, longitude } = location;

            if (!mapRef.current) {
                initializeMap(mapRef, latitude, longitude);
            }

            createMarkersParking(parkings, mapRef);
            updateMarker(markerRef, mapRef, latitude, longitude);
        }
    }, [location, parkings]);

    return (
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
    );
};

const initializeMap = (mapRef, latitude, longitude) => {
    const mapOptions = {
        center: [latitude, longitude],
        zoom: 14,
    };

    mapRef.current = L.map("map", mapOptions);

    const layer = L.tileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );

    mapRef.current.addLayer(layer);
}

const createMarkersParking = (parkings, mapRef) => {
    parkings.forEach(parking => {
        let iconClass;
        if (parking.Status === 'פנוי') {
            iconClass = 'my-icon-primary';
        } else if (parking.Status === 'מעט') {
            iconClass = 'my-icon-secondary';
        } else {
            iconClass = 'my-icon-disabled';
        }

        const iconHtml = renderToString(<div className={iconClass}><LocationOnIcon color="primary" /></div>);
    
        const customIcon = L.divIcon({
            className: 'my-icon',
            html: iconHtml,
            iconSize: [20, 20],
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