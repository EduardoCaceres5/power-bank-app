import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Flex,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { MdAdd, MdEdit, MdDelete, MdRefresh } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Group } from '@/types/api.types';

export default function ScreenGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const addModal = useDisclosure();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroups({ page: 1 });
      if (response.success && response.data) {
        setGroups(response.data.list);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Flex mb={6} justify="space-between">
        <HStack>
          <IconButton aria-label="Actualizar" icon={<MdRefresh />} onClick={loadGroups} variant="ghost" />
        </HStack>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={addModal.onOpen}>
          Agregar Grupo
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Materiales</Th>
                <Th>Creado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groups.map((group) => (
                <Tr key={group.id}>
                  <Td>{group.id}</Td>
                  <Td fontWeight="medium">{group.name}</Td>
                  <Td>{group.material_count || 0} materiales</Td>
                  <Td>{new Date(group.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton aria-label="Editar" icon={<MdEdit />} size="sm" variant="ghost" />
                      <IconButton aria-label="Eliminar" icon={<MdDelete />} size="sm" colorScheme="red" variant="ghost" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
