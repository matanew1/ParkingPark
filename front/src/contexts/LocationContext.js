// LocationContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const LocationContext = createContext();

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}

export function LocationProvider({ children }) {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [parkings, setParkings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/parking/stations`, {
                    headers: {'Content-Type': 'application/json'}
                });
                console.log(response.data);
                setParkings(response.data);
            } catch (error) {
                setError(error);
                fetchData();
            }
        };

        // Call once immediately
        fetchData();

        // Then call every 30 seconds
        const interval = setInterval(fetchData, 30000); // 30 seconds

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let watchId;

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            }, (error) => {
                console.log(error);
                setError(error.message);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } else {
            const errorMessage = "Geolocation is not supported by this browser.";
            console.log(errorMessage);
            setError(errorMessage);
        }

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []); // Removed setLocation and setError from the dependency array

    const value = {
        location,
        error,
        setLocation,
        setError,
        parkings,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}