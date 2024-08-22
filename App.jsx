import React, { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { Switch, Route, Router, useRoute, Link, useLocation } from "wouter";
import LoginCard from "./pages/Login";
import SignupCard from "./pages/Signup";
import UserList from "./pages/UserList";
import AdminOnly from "./pages/AdminOnly";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import {
  ChakraProvider,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import TopBar from "./components/TopBar/TopBar";
import AlertSummary from "./components/AlertSummary/AlertSummary";
import MapView from "./components/MapView/MapView";
import AvailableCameras from "./components/AvailableCameras/AvailableCameras";
import CameraView from "./components/CameraView/CameraView";
import RiskHistoryChart from "./components/RiskHistoryChart/RiskHistoryChart";
import AlertHistory from "./components/AlertHistory/AlertHistory";
import FireApp from "./pages/FireApp";

// Crea el contexto de autenticación
const AuthContext = createContext({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

// Componente CustomLink (opcional, para estilos)
const CustomLink = ({ children, href, onClick }) => {
  const [isActive] = useRoute(href);
  return (
    <Link
      href={href}
      color={isActive ? "gray.200" : "gray.800"}
      _hover={{ textDecoration: "none", color: "green.400" }}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Componente Home
const Home = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      color={useColorModeValue("gray.400", "gray.800")}
      w="full"
    >
      <Box
        p={5}
        shadow="xl"
        borderWidth="1px"
        borderRadius="lg"
        bg={useColorModeValue("gray.400", "gray.800")}
        maxW="lg"
      >
        <Heading fontSize="2xl" textAlign="center">
          IronFire
        </Heading>
        <Text mt={4} fontSize="lg" textAlign="center">
          IronFire
        </Text>
      </Box>
    </Flex>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const toast = useToast();
  const [, setLocation] = useLocation();

  // Manejo del inicio de sesión (solo actualiza el estado y redirige)
  const handleLogin = (credentials) => {
    localStorage.setItem("token", credentials.token); // Guarda el token en el localStorage
    setIsAuthenticated(true);
    setUser({ role: credentials.role }); // Asigna el rol del usuario
    setLocation("/fire-app"); // Redirige a la página de la aplicación
    toast({
      title: "Success",
      description: "Login successful",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Manejo del cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Success",
      description: "Logout successful",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Cargar el token y la información del usuario desde localStorage al cargar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      setUser({ role: "admin" });
    }
  }, []);

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          token: localStorage.getItem("token"),
          user,
          login: handleLogin,
          logout: handleLogout,
        }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="App"
        >
          <nav>
            <CustomLink href="/"> Home </CustomLink>
            {!isAuthenticated ? (
              <>
                <CustomLink href="/login"> Login </CustomLink>
                <CustomLink href="/signup"> Signup </CustomLink>
              </>
            ) : (
              <>
                <CustomLink href="/users"> Users </CustomLink>
                <CustomLink href="/admin-only"> Admin-Only </CustomLink>
                <CustomLink href="/" onClick={handleLogout}>
                  Logout
                </CustomLink>
              </>
            )}
          </nav>

          <Box
            as="main"
            p={4}
            w="full"
            bg={useColorModeValue("white", "gray.800")}
            boxShadow="sm"
            rounded="md"
          >
            <Router>
              <Route path="/" component={Home} />
              <Route path="/login" component={LoginCard} />
              <Route path="/signup" component={SignupCard} />
              <Route path="/users" component={UserList} />
              {/* Envolver las rutas que requieren autenticación */}
              <Route path="/admin-only">
                <AdminOnlyRoute>
                  <AdminOnly />
                </AdminOnlyRoute>
              </Route>
              <Route path="/FireApp">
                <AdminOnlyRoute>
                  <FireApp />
                </AdminOnlyRoute>
              </Route>
              <Route path="/:rest*">
                {({ rest }) => (
                  <Flex justify="center" align="center" height="100vh">
                    <Text fontSize="xl">
                      <strong></strong> <code></code>
                    </Text>
                  </Flex>
                )}
              </Route>
            </Router>
          </Box>
        </Flex>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;

export { AuthContext };
