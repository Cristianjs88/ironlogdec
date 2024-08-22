import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import UserModal from '../components/UserModal'; 

const UserList = () => {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null); // Agrega estado para errores
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Obtiene el token de acceso desde el almacenamiento (por ejemplo, localStorage)
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        // Si no hay token, redirige al usuario a la página de inicio de sesión
        // Puedes usar 'useNavigate' de React Router para esto
        // Ejemplo:
        // const navigate = useNavigate();
        // navigate('/login');
        return; // Sale de la función
      }

      const response = await fetch('http://127.0.0.1:8355/api/v1/users', { // Cambia la URL a /users
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Incluye el token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching users');
      }

      const data = await response.json();
      setUsers(data); // Actualiza el estado con el arreglo de usuarios
      setError(null); // Restablece el estado de error
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message); // Actualiza el estado de error
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8355/api/v1/users`, { // Cambia la URL a /users/:id
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error deleting user'); 
      }
      fetchUsers(); 
    } catch (error) {
      console.error('Error deleting user:', error);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  return (
    <Box>
      <Heading mb={4}>Lista de Usuarios</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Table>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Rol</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.length > 0 ? ( // Verifica si hay usuarios en el arreglo
            users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <Button colorScheme="blue" mr={2} onClick={() => handleEdit(user)}>
                    Editar
                  </Button>
                  <Button colorScheme="red" onClick={() => handleDelete(user.id)}>
                    Eliminar
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4}>No hay usuarios</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <UserModal
        isOpen={isOpen}
        onClose={onClose}
        user={selectedUser}
        onSave={fetchUsers}
      />
    </Box>
  );
};

export default UserList;