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
  Badge,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Flex,
  Spinner,
  Image,
  HStack,
} from '@chakra-ui/react';
import { MdAdd, MdDelete, MdRefresh } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Material } from '@/types/api.types';

export default function ScreenMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const addModal = useDisclosure();

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMaterials({ page: 1 });
      if (response.success && response.data) {
        setMaterials(response.data.list);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Flex mb={6} justify="space-between">
        <HStack>
          <IconButton aria-label="Actualizar" icon={<MdRefresh />} onClick={loadMaterials} variant="ghost" />
        </HStack>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={addModal.onOpen}>
          Agregar Material
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
                <Th>Vista Previa</Th>
                <Th>Nombre</Th>
                <Th>Tipo</Th>
                <Th>Ruta</Th>
                <Th>Creado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {materials.map((material) => (
                <Tr key={material.id}>
                  <Td>
                    {material.type === 'image' && (
                      <Image src={material.path} boxSize="50px" objectFit="cover" borderRadius="md" />
                    )}
                  </Td>
                  <Td fontWeight="medium">{material.name}</Td>
                  <Td>
                    <Badge colorScheme={material.type === 'image' ? 'blue' : 'purple'}>
                      {material.type}
                    </Badge>
                  </Td>
                  <Td fontSize="sm" color="gray.500">{material.path}</Td>
                  <Td>{new Date(material.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <IconButton aria-label="Eliminar" icon={<MdDelete />} size="sm" colorScheme="red" variant="ghost" />
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
