// Map.js
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Grid } from '@mui/material';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { renderToString } from 'react-dom/server';
import "./Map.css"; // Import the CSS file
import { useLocation } from '../../contexts/LocationContext';

const Map = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const {location, error, setLocation, setError } = useLocation();

    useEffect(() => {
        console.log(location);
        const { latitude, longitude } = location;

        if (!mapRef.current) {
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

        const iconSvgHtml = renderToString(<div className="flashing-icon"><DirectionsCarFilledIcon color="primary" /></div>);
        const myIcon = L.divIcon({
            className: 'my-icon',
            html: iconSvgHtml,
            iconSize: [38, 38],
        });

        if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
        } else {
            markerRef.current = L.marker([latitude, longitude], {icon: myIcon}).addTo(mapRef.current);
        }
    }, [location]); // This effect runs once after the initial render and whenever the location changes

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

export default Map;