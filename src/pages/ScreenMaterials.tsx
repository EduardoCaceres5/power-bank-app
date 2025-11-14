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
  Image,
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { MdAdd, MdDelete, MdRefresh } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Material } from '@/types/api.types';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { AddMaterialModal } from '@/components/materials/AddMaterialModal';
import { useRef } from 'react';

export default function ScreenMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const addModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar los materiales',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;

    try {
      setDeleteLoading(materialToDelete.id);
      const response = await apiService.deleteMaterial(materialToDelete.id);

      if (response.success) {
        toast({
          title: 'Material eliminado',
          description: 'El material se ha eliminado exitosamente',
          status: 'success',
          duration: 3000,
        });

        // Reload materials
        await loadMaterials();
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar el material',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setDeleteLoading(null);
      setMaterialToDelete(null);
      deleteDialog.onClose();
    }
  };

  return (
    <Box>
      <Flex mb={6} justify="space-between">
        <HStack>
          <IconButton
            aria-label="Actualizar"
            icon={<MdRefresh />}
            onClick={loadMaterials}
            variant="ghost"
            isLoading={loading}
          />
        </HStack>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={addModal.onOpen}>
          Agregar Material
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Box p={6}>
            <TableSkeleton rows={8} />
          </Box>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Vista Previa</Th>
                <Th>Nombre</Th>
                <Th>Tipo</Th>
                <Th>Ruta</Th>
                <Th>Duración (seg)</Th>
                <Th>Creado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {materials.map((material) => (
                <Tr key={material.id}>
                  <Td>
                    {material.type === 'image' && (
                      <Image src={material.file} boxSize="50px" objectFit="cover" borderRadius="md" />
                    )}
                  </Td>
                  <Td fontWeight="medium">{material.name || 'Sin nombre'}</Td>
                  <Td>
                    <Badge colorScheme={material.type === 'image' ? 'blue' : 'purple'}>
                      {material.type === 'image' ? 'Imagen' : 'Video'}
                    </Badge>
                  </Td>
                  <Td fontSize="sm" color="gray.500" maxW="300px" isTruncated>
                    {material.file}
                  </Td>
                  <Td>{material.seconds || '-'}</Td>
                  <Td>{new Date(material.create_time * 1000).toLocaleDateString()}</Td>
                  <Td>
                    <IconButton
                      aria-label="Eliminar"
                      icon={<MdDelete />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteClick(material)}
                      isLoading={deleteLoading === material.id}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <AddMaterialModal
        isOpen={addModal.isOpen}
        onClose={addModal.onClose}
        onSuccess={loadMaterials}
      />

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Material
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el material "{materialToDelete?.name || 'Sin nombre'}"?
              Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3} isLoading={deleteLoading !== null}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
