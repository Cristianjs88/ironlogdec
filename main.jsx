import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './App.css';

// Seleccionamos el contenedor donde montaremos la app
const container = document.getElementById('root');

// Creamos el root de forma segura, solo si no existe previamente
let root = container._reactRootContainer;
if (!root) {
  root = ReactDOM.createRoot(container);
}

// Renderizamos la app en el root
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App /> 
    </ChakraProvider>
  </React.StrictMode>
);
