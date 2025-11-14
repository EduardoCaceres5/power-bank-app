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
  Badge,
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
import type { Plan } from '@/types/api.types';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { AddEditPlanModal } from '@/components/plans/AddEditPlanModal';

export default function ScreenPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const addEditModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPlans({ page: 1 });
      if (response.success && response.data) {
        setPlans(response.data.list);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo cargar los planes',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedPlanId(null);
    addEditModal.onOpen();
  };

  const handleEditClick = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    addEditModal.onOpen();
  };

  const handleDeleteClick = (plan: Plan) => {
    setPlanToDelete(plan);
    deleteDialog.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      setDeleteLoading(planToDelete.id);
      const response = await apiService.deletePlan(planToDelete.id);

      if (response.success) {
        toast({
          title: 'Plan eliminado',
          description: 'El plan se ha eliminado exitosamente',
          status: 'success',
          duration: 3000,
        });

        // Reload plans
        await loadPlans();
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar el plan',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setDeleteLoading(null);
      setPlanToDelete(null);
      deleteDialog.onClose();
    }
  };

  const isPlanActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <Box>
      <Flex mb={6} justify="space-between">
        <HStack>
          <IconButton
            aria-label="Actualizar"
            icon={<MdRefresh />}
            onClick={loadPlans}
            variant="ghost"
            isLoading={loading}
          />
        </HStack>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={handleAddClick}>
          Agregar Plan
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Box p={6}>
            <TableSkeleton rows={6} />
          </Box>
        ) : plans.length === 0 ? (
          <Box p={8} textAlign="center">
            <Box fontSize="lg" fontWeight="medium" color="gray.600" mb={2}>
              No hay planes creados
            </Box>
            <Box fontSize="sm" color="gray.500">
              Crea tu primer plan para programar la visualización de grupos en gabinetes
            </Box>
          </Box>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre del Plan</Th>
                <Th>Estado</Th>
                <Th>Fecha de Inicio</Th>
                <Th>Fecha de Fin</Th>
                <Th>Gabinetes</Th>
                <Th>Creado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {plans.map((plan) => (
                <Tr key={plan.id}>
                  <Td>{plan.id}</Td>
                  <Td fontWeight="medium">{plan.plan_name}</Td>
                  <Td>
                    <Badge colorScheme={isPlanActive(plan.start_date, plan.end_date) ? 'green' : 'gray'}>
                      {isPlanActive(plan.start_date, plan.end_date) ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Td>
                  <Td>{plan.start_date}</Td>
                  <Td>{plan.end_date}</Td>
                  <Td fontSize="sm">{plan.equipment_group.split(',').length} gabinetes</Td>
                  <Td>{new Date(plan.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Editar"
                        icon={<MdEdit />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(plan)}
                      />
                      <IconButton
                        aria-label="Eliminar"
                        icon={<MdDelete />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(plan)}
                        isLoading={deleteLoading === plan.id}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <AddEditPlanModal
        isOpen={addEditModal.isOpen}
        onClose={addEditModal.onClose}
        onSuccess={loadPlans}
        planId={selectedPlanId}
      />

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Plan
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el plan "{planToDelete?.plan_name}"? Esta
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
