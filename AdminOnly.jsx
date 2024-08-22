import React, { useContext } from 'react';
import { AuthContext } from '../App';  
import { Flex, Box, Heading, Text, Button, useColorModeValue, Link } from '@chakra-ui/react';
import TopBar from '../components/TopBar/TopBar';
import AlertSummary from '../components/AlertSummary/AlertSummary';
import MapView from '../components/MapView/MapView';
import AvailableCameras from '../components/AvailableCameras/AvailableCameras';
import CameraView from '../components/CameraView/CameraView';
import RiskHistoryChart from '../components/RiskHistoryChart/RiskHistoryChart';
import AlertHistory from '../components/AlertHistory/AlertHistory';
import FireApp from './FireApp';

const AdminOnly = () => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'admin') {
    // Si el usuario no está autenticado o no es admin, muestra un mensaje de error
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        minHeight="100vh"
        color={useColorModeValue('gray.800', 'white')}
        w="full"
      >
        <Box
          p={5}
          shadow="xl"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.800')}
          maxW="lg"
        >
          <Heading fontSize="2xl" textAlign="center">Acceso Denegado</Heading>
          <Text mt={4} fontSize="lg" textAlign="center">
            No tienes permiso para acceder a esta página. Por favor, inicia sesión como administrador.
          </Text>
          <Link href="/login" color="blue.500">Inicia sesión</Link>
        </Box>
      </Flex>
    );
  }

  // Si el usuario es administrador, renderiza la aplicación de detección de incendios
  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" color={useColorModeValue('gray.800', 'white')} w="full">
      <FireApp/>
    </Flex>
  );
};

export default AdminOnly;