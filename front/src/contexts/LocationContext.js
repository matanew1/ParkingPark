// LocationContext.js
import { createContext, useContext, useEffect, useState } from "react";

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
    }, []);

    const value = {
        location,
        error,
        setLocation,
        setError
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}