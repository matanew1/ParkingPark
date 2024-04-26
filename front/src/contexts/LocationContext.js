// LocationContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const LocationContext = createContext();

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [parkings, setParkings] = useState(null);
  // const baseUrl = "http://localhost:4000/api/parking";
  const baseUrl = "https://parking-park-server.vercel.app/api/parking";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/stations`, {
          headers: { "Content-Type": "application/json" },
        });
        setParkings(response.data);
        setLoading(false); // Set loading to false when data is loaded
        setTimeout(fetchData, 30000); // Schedule next fetch in 30 seconds
      } catch (error) {
        console.log(error.response);
        if (error.response && error.response.status === 500) {
          setTimeout(fetchData, 7000); // Schedule next fetch in 7 seconds if there is a server error
        } else {
          setTimeout(fetchData, 6000); // Schedule next fetch in 6 seconds for other errors
        }
        setError(error);
      }
    };

    // Call once immediately
    fetchData();
  }, []); // Empty dependency array so this effect only runs once

  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      const errorMessage = "Geolocation is not supported by this browser.";
      setError(errorMessage);
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Removed setLocation and setError from the dependency array

  const buildQueryString = (params) => {
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
  };

  const findClosestParking = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/stations/closestStation?${buildQueryString(location)}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      setError(error);
    }
  };

  const findCheapestParking = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/stations/cheapestStation?${buildQueryString(location)}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error);
    }
  };

  const value = {
    location,
    error,
    setLocation,
    setError,
    parkings,
    findClosestParking,
    findCheapestParking,
    loading,
    setLoading,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
