import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Hidden,
  Box,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Fab,
  Paper,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationIcon from "@mui/icons-material/Navigation";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { renderToString } from "react-dom/server";
import "./Map.css"; // Import the CSS file
import { useLocation } from "../../contexts/LocationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "leaflet.polyline.snakeanim/L.Polyline.SnakeAnim.js";
import { PARKING_STATUS, ICON_CLASSES } from "../../utils/constants";
import { Backdrop, CircularProgress } from "@mui/material";


const Map = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const {
    location,
    parkings,
    findClosestParking,
    findCheapestParking,
    loading,
    setLoading,
  } = useLocation();
  const { currentUser } = useAuth();
  const [closestParking, setClosestParking] = useState(null);
  const [cheapestParking, setCheapestParking] = useState(null);
  const navigate = useNavigate();
  const [lineClose, setLineClose] = useState(null);
  const [lineCheap, setLineCheap] = useState(null);
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // useMemo is used to memoize the map options - this is useful when the map options are not changing
  const mapOptions = useMemo(
    () => ({
      center: location ? [location.latitude, location.longitude] : [0, 0],
      zoom: 13,
      minZoom: 10, // Minimum zoom level
      maxZoom: 18, // Maximum zoom level
      preload: Infinity, // Preload the tile images to improve the user experience
      zoomControl: false, // Disable the default zoom control
      zoomSnap: 0.2, // Snap to zoom level increments of 0.2
      renderer: L.canvas(),
      maxBounds: L.latLngBounds(L.latLng(29, 34), L.latLng(34, 37)), // Restrict the view to the given geographical bounds
    }),
    [location]
  );
  const handleLocationClick = useCallback(
    (latitude, longitude) => {
      console.log("object");
      mapRef.current.setView([latitude, longitude], 14);
    },
    [mapRef]
  );
  const zoomMyLocation = () => {
    if (location) {
      mapRef.current.setView([location.latitude, location.longitude], 14);
    }
  };
  const closestParkingSpot = async () => {
    if (closestParking) {
      const { GPSLattitude, GPSLongitude } = closestParking;
      mapRef.current.setView([GPSLattitude, GPSLongitude], 14);
      return;
    }
    const res = await findClosestParking();
    setClosestParking(res);
    const { GPSLattitude, GPSLongitude } = res;
    mapRef.current.setView([GPSLattitude, GPSLongitude], 14);
  };

  const cheapestParkingSpot = async () => {
    if (cheapestParking) {
      const { GPSLattitude, GPSLongitude } = cheapestParking;
      mapRef.current.setView([GPSLattitude, GPSLongitude], 14);
      return;
    }
    setLoading(true);
    const res = await findCheapestParking();
    if (!res || !res.GPSLattitude || !res.GPSLongitude) {
      console.error("findCheapestParking did not return the expected result");
      setLoading(false);
      return;
    }
    setLoading(false);
    console.log(res);
    setCheapestParking(res);
    const { GPSLattitude, GPSLongitude } = res;
    mapRef.current.setView([GPSLattitude, GPSLongitude], 14);
  };

  const resetAll = () => {
    setClosestParking(null);
    setCheapestParking(null);
    if (lineClose) {
      mapRef.current.removeLayer(lineClose);
      setLineClose(null);
    }
    if (lineCheap) {
      mapRef.current.removeLayer(lineCheap);
      setLineCheap(null);
    }

    // clear cheapest parking and closest parking markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        if (
          layer.options.icon.options.className === ICON_CLASSES.CHEAPEST ||
          layer.options.icon.options.className === ICON_CLASSES.CLOSEST
        ) {
          mapRef.current.removeLayer(layer);
        }
      }
    });

    createMarkersParking(
      handleLocationClick,
      null,
      null,
      parkings,
      mapRef
    );

    
  };

  useIsomorphicLayoutEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      if (!mapRef.current) {
        // Add null check for latitude and longitude
        if (latitude !== null && longitude !== null) {
          initializeMap(mapRef, latitude, longitude, mapOptions);
        }
      }
      carMarker(markerRef, mapRef, latitude, longitude);
    }
    if (parkings && mapRef.current) {
      // Add null check here
      createMarkersParking(
        handleLocationClick,
        cheapestParking,
        closestParking,
        parkings,
        mapRef
      );
    }
    if (parkings && closestParking && location && mapRef.current) {
      drawLineToParking(
        location,
        closestParking,
        mapRef,
        lineClose,
        setLineClose
      );
    }

    if (parkings && cheapestParking && location && mapRef.current) {
      drawLineToParking(
        location,
        cheapestParking,
        mapRef,
        lineCheap,
        setLineCheap
      );
    }
  }, [
    location,
    parkings,
    cheapestParking,
    closestParking,
    lineCheap,
    lineClose,
    mapOptions,
  ]);

  return (
    <>
      <Backdrop
        sx={{ color: "black", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading} // Use loading state here
      >
        Loading data from server... &nbsp;&nbsp;
        <CircularProgress color="inherit" />
      </Backdrop>

      <AppBar
        position="absolute"
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: "transparent",
          justifyContent: "end",
          alignItems: "end",
          display: "flex",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.9)",
            borderRadius: "10px",
          }}
        >
          <Hidden xsDown>
            <Grid
              container
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid item xs={2} sm={2} md={2.2} lg={2}>
                <Fab
                  variant="extended"
                  onClick={() =>
                    navigate("/profile/" + currentUser.reloadUserInfo.localId)
                  }
                  style={{
                    margin: "10px",
                    backgroundColor: "transparent",
                    color: "purple",
                  }}
                >
                  <ArrowBackIcon />
                  <Hidden mdDown>
                    <Typography variant="body1" style={{ marginLeft: "10px" }}>
                      Back to profile
                    </Typography>
                  </Hidden>
                </Fab>
              </Grid>
              <Grid item xs={2} sm={2} md={2.9} lg={3}>
                <Fab
                  variant="extended"
                  onClick={cheapestParkingSpot}
                  style={{
                    margin: "10px",
                    backgroundColor: "transparent",
                    color: "purple",
                  }}
                  disabled={loading}
                >
                  {parkings && loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <AttachMoneyIcon />
                  )}

                  <Hidden mdDown>
                    <Typography variant="body1" style={{ marginLeft: "10px" }}>
                      Cheapest Parking Spot
                    </Typography>
                  </Hidden>
                </Fab>
              </Grid>
              <Grid item xs={2.3} sm={2.5} md={2.9} lg={3}>
                <Fab
                  variant="extended"
                  disabled={!parkings}
                  onClick={closestParkingSpot}
                  style={{
                    margin: "10px",
                    backgroundColor: "transparent",
                    color: "purple",
                  }}
                >
                  <NavigationIcon sx={{ mr: 1 }} />
                  <Hidden mdDown>
                    <Typography variant="body1">
                      Closest Parking Spot
                    </Typography>
                  </Hidden>
                </Fab>
              </Grid>
              <Grid item xs={2.3} sm={2.5} md={2.3} lg={2}>
                <Fab
                  variant="extended"
                  aria-label="map"
                  disabled={!parkings}
                  style={{
                    margin: "10px",
                    backgroundColor: "transparent",
                    color: "purple",
                  }}
                  onClick={zoomMyLocation}
                >
                  <LocationSearchingIcon />
                  <Hidden mdDown>
                    <Typography variant="body1" style={{ marginLeft: "10px" }}>
                      My location
                    </Typography>
                  </Hidden>
                </Fab>
              </Grid>
              <Grid item xs={2.5} sm={2} md={1} lg={2}>
                <Fab
                  variant="extended"
                  onClick={resetAll}
                  style={{
                    backgroundColor: "transparent",
                    color: "purple",
                  }}
                >
                  <RestartAltIcon />
                  <Hidden mdDown>
                    <Typography variant="body1" style={{ marginLeft: "10px" }}>
                      RESET
                    </Typography>
                  </Hidden>
                </Fab>
              </Grid>
            </Grid>
          </Hidden>
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

const drawLineToParking = (
  location,
  cheapestParking,
  mapRef,
  line,
  setLine
) => {
  if (
    !location ||
    !cheapestParking ||
    !location.latitude ||
    !location.longitude ||
    !cheapestParking.GPSLattitude ||
    !cheapestParking.GPSLongitude
  ) {
    return;
  }

  const latLngs = [
    [
      [location.latitude, location.longitude],
      [cheapestParking.GPSLattitude, cheapestParking.GPSLongitude],
    ],
  ];

  if (line) {
    line.setLatLngs(latLngs);
  } else {
    const newLine = L.polyline(latLngs, {
      color: "green",
      dashArray: "10, 10",
    }).addTo(mapRef.current);
    newLine.snakeIn(); // animate the line
    setLine(newLine);
  }
};

const initializeMap = (mapRef, latitude, longitude, mapOptions) => {
  mapRef.current = L.map("map", mapOptions);

  const layer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", // Use HTTPS instead of HTTP
    { attribution: "© OpenStreetMap", maxZoom: 18 }
  );

  L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

  layer.addTo(mapRef.current);
};

const createMarkersParking = (
  handleLocationClick,
  cheapestParking,
  closestParking,
  parkings,
  mapRef
) => {
  parkings.forEach((parking) => {
    let iconClass;

    if (closestParking && parking.Code === closestParking.Code) {
      iconClass = ICON_CLASSES.CLOSEST;
    } else if (cheapestParking && parking.Code === cheapestParking.Code) {
      iconClass = ICON_CLASSES.CHEAPEST;
    } else if (parking.Status === PARKING_STATUS.AVAILABLE) {
      iconClass = ICON_CLASSES.PRIMARY;
    } else if (parking.Status === PARKING_STATUS.FEW) {
      iconClass = ICON_CLASSES.SECONDARY;
    } else if (parking.Status === PARKING_STATUS.FULL) {
      iconClass = ICON_CLASSES.DISABLED;
    } else if (parking.Status === PARKING_STATUS.CLOSED) {
      iconClass = ICON_CLASSES.CLOSED;
    }

    const iconHtml = renderToString(
      <div className={iconClass}>
        <LocationOnIcon color="primary" />
      </div>
    );

    const customIcon = L.divIcon({
      className: "my-icon",
      html: iconHtml,
      iconSize: [30, 30],
    });

    const marker = L.marker([parking.GPSLattitude, parking.GPSLongitude], {
      icon: customIcon,
    }).addTo(mapRef.current);

    // Add a click event to the marker
    marker.on("click", () => {
      const popupHtml = renderToString(
        <Grid
          container
          direction="column"
          style={{ color: "#333", fontFamily: "Arial", fontWeight: "bold" }}
        >
          <Grid item>
            <Typography
              variant="h3"
              style={{ color: "#3f51b5", textAlign: "center" }}
            >
              Parking Status: {parking.Status}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h4"
              style={{ color: "#3f51b5", textAlign: "center" }}
            >
              Location:{parking.GPSLattitude}, {parking.GPSLongitude}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              <LocalParkingIcon />
              &nbsp;&nbsp;&nbsp;Parking Name:
            </Typography>
          </Grid>
          <Grid item>
            <Paper
              style={{
                textAlign: "center",
                backgroundColor: "#f0f0f0",
                padding: "3px",
                borderRadius: "15px", // Add this line
              }}
            >
              {parking.Name}
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              <BusinessIcon />
              &nbsp;&nbsp;&nbsp;Parking Address:
            </Typography>
          </Grid>
          <Grid item>
            <Paper
              style={{
                textAlign: "center",
                padding: "5px",
                backgroundColor: "#f0f0f0",
                borderRadius: "15px", // Add this line
              }}
            >
              {parking.Address}
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              <AccessTimeIcon />
              &nbsp;&nbsp;&nbsp;Parking Time Fee:
            </Typography>
          </Grid>
          <Grid item>
            <Paper
              style={{
                textAlign: "right",
                padding: "5px",
                backgroundColor: "#f0f0f0",
                borderRadius: "15px", // Add this line
                direction: "rtl", // Add this line
              }}
            >
              {parking.DaytimeFee.split("‡").join("\n")}
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              <AttachMoneyIcon />
              &nbsp;&nbsp;&nbsp;Additional information:
            </Typography>
          </Grid>
          <Grid item>
            <Paper
              style={{
                textAlign: "right",
                padding: "3px",
                margin: "0",
                backgroundColor: "#f0f0f0",
                borderRadius: "15px", // Add this line
                direction: "rtl", // Add this line
              }}
            >
              {parking.FeeComments.split("‡").join("\n")}
            </Paper>
          </Grid>
        </Grid>
      );
      marker.bindPopup(popupHtml).openPopup();
    });
  });
};

const carMarker = (markerRef, mapRef, latitude, longitude) => {
  const iconSvgHtml = renderToString(
    <div className="flashing-icon">
      <DirectionsCarFilledIcon color="primary" />
    </div>
  );
  const myIcon = L.divIcon({
    className: "my-icon",
    html: iconSvgHtml,
    iconSize: [38, 38],
  });

  // Update the user's marker
  if (markerRef.current) {
    markerRef.current.setLatLng([latitude, longitude]);
  } else {
    markerRef.current = L.marker([latitude, longitude], { icon: myIcon }).addTo(
      mapRef.current
    );
  }

  markerRef.current.on("click", () => {
    markerRef.current
      .bindPopup(`<b>Location:</b> ${latitude}, ${longitude}`)
      .openPopup();
  });
};

export default Map;
