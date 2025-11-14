import { useEffect, useState, useRef } from 'react';
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
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { MdAdd, MdEdit, MdDelete, MdRefresh } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Group } from '@/types/api.types';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { AddEditGroupModal } from '@/components/groups/AddEditGroupModal';

export default function ScreenGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const addEditModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroups({ page: 1 });
      if (response.success && response.data) {
        setGroups(response.data.list);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo cargar los grupos',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddClick = () => {
    setSelectedGroupId(null);
    addEditModal.onOpen();
  };

  const handleEditClick = (group: Group) => {
    setSelectedGroupId(group.id);
    addEditModal.onOpen();
  };

  const handleDeleteClick = (group: Group) => {
    setGroupToDelete(group);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;

    try {
      setDeleteLoading(groupToDelete.id);
      const response = await apiService.deleteGroup(groupToDelete.id);

      if (response.success) {
        toast({
          title: 'Grupo eliminado',
          description: 'El grupo se ha eliminado exitosamente',
          status: 'success',
          duration: 3000,
        });

        // Reload groups
        await loadGroups();
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar el grupo',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setDeleteLoading(null);
      setGroupToDelete(null);
      deleteDialog.onClose();
    }
  };

  const calculateMaterialCount = (group: Group): number => {
    // Try to get count from material_count, or from details array if available
    if (group.material_count !== undefined) {
      return group.material_count;
    }
    // Check if details array exists (might not be typed but could be in response)
    const groupWithDetails = group as Group & { details?: unknown[] };
    if (groupWithDetails.details && Array.isArray(groupWithDetails.details)) {
      return groupWithDetails.details.length;
    }
    return 0;
  };

  return (
    <Box>
      <Flex mb={6} justify="space-between">
        <HStack>
          <IconButton
            aria-label="Actualizar"
            icon={<MdRefresh />}
            onClick={loadGroups}
            variant="ghost"
            isLoading={loading}
          />
        </HStack>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={handleAddClick}>
          Agregar Grupo
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Box p={6}>
            <TableSkeleton rows={6} />
          </Box>
        ) : groups.length === 0 ? (
          <Box p={8} textAlign="center">
            <Box fontSize="lg" fontWeight="medium" color="gray.600" mb={2}>
              No hay grupos creados
            </Box>
            <Box fontSize="sm" color="gray.500">
              Crea tu primer grupo para organizar tus materiales publicitarios
            </Box>
          </Box>
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
                  <Td fontWeight="medium">{group.group_name}</Td>
                  <Td>{calculateMaterialCount(group)} materiales</Td>
                  <Td>{new Date(group.create_time * 1000).toLocaleDateString()}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Editar"
                        icon={<MdEdit />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(group)}
                      />
                      <IconButton
                        aria-label="Eliminar"
                        icon={<MdDelete />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(group)}
                        isLoading={deleteLoading === group.id}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <AddEditGroupModal
        isOpen={addEditModal.isOpen}
        onClose={addEditModal.onClose}
        onSuccess={loadGroups}
        groupId={selectedGroupId}
      />

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Grupo
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el grupo "{groupToDelete?.group_name}"? Esta
              acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteLoading !== null}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
