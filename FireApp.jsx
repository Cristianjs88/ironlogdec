import React, { useState, useContext } from "react";
import { AuthContext } from "../App"; // Ajusta la ruta si es necesario
import {
  Grid,
  GridItem,
  useColorModeValue,
  useColorMode,
  Box,
} from "@chakra-ui/react";
import TopBar from "../components/TopBar/TopBar";
import AlertSummary from "../components/AlertSummary/AlertSummary";
import WeatherBox from "../components/WeatherBox/WeatherBox";
import FireAlertBox from "../components/FireAlertBox/FireAlertBox";
import GradientBox from "../components/GradientBox/GradientBox";
import DashboardImage from "../components/icons/DashAbajo.png";
import MapView from "../components/MapView/MapView"; // Importa el componente MapView
import CameraView from "../components/CameraView/CameraView"; // Importa el componente CameraView

const FireApp = () => {
  const { user } = useContext(AuthContext);
  const { colorMode } = useColorMode();

  // Define appBgColor y componentBgColor aquí
  const appBgColor = useColorModeValue("gray.300", "gray.800");
  const componentBgColor = useColorModeValue("gray.300", "gray.800");

  const [location, setLocation] = useState({
    latitude: -34.61315,
    longitude: -58.37723,
  });

  const handleLocationChange = (newLatitude, newLongitude) => {
    setLocation({ latitude: newLatitude, longitude: newLongitude });
  };

  return (
    <Grid
      templateColumns="50px 1fr"
      gap={4}
      h="100vh"
      bg={appBgColor} // Ahora puedes usar appBgColor aquí
      color={useColorModeValue("gray.800", "gray.300")}
    >
      <GridItem p={0}>
        <TopBar />
      </GridItem>

      <GridItem p={4}>
        <Grid templateColumns="repeat(12, 1fr)" gap={2}>
          <GridItem colSpan={3}>
            <WeatherBox
              bgColor={componentBgColor}
              latitude={location.latitude}
              longitude={location.longitude}
            />
          </GridItem>

          <GridItem colSpan={6}>
            <GradientBox>
              <AlertSummary bgColor={componentBgColor} />
            </GradientBox>
          </GridItem>

          <GridItem colSpan={3} h="100%">
            <FireAlertBox />
          </GridItem>

          {/* Box para mostrar la imagen (comentado) */}
          {/* <GridItem
            colSpan={12}
            p={2}
            rounded="xl"
            bg={componentBgColor}
            borderWidth="1px"
            borderColor={useColorModeValue("gray.300", "gray.800")}
            mt={-4}
            flex={1}
          >
            <Box w="100%" h="100%" overflow="hidden">
              <img
                src={DashboardImage} // ¡Reemplaza con la ruta correcta!
                alt="Mapa"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </GridItem> */}

          {/* Renderiza el componente MapView */}
          <GridItem colSpan={5} mt={4}>
            <MapView />
          </GridItem>

          {/* Renderiza el componente CameraView */}
          <GridItem colSpan={7} mt={4}>
            <CameraView />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

export default FireApp;
