// src/contexts/LocationContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const LocationContext = createContext({
  latitude: null,
  longitude: null,
});

const LocationProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <LocationContext.Provider value={{ latitude, longitude }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
