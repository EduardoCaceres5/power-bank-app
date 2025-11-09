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
  HStack,
} from '@chakra-ui/react';
import { MdAdd, MdEdit, MdDelete, MdRefresh } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Plan } from '@/types/api.types';
import { TableSkeleton } from '@/components/common/SkeletonLoader';

export default function ScreenPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const addModal = useDisclosure();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPlans({ page: 1 });
      if (response.success && response.data) {
        setPlans(response.data.list);
      }
    } finally {
      setLoading(false);
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
          <IconButton aria-label="Actualizar" icon={<MdRefresh />} onClick={loadPlans} variant="ghost" />
        </HStack>
        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={addModal.onOpen}>
          Agregar Plan
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Box p={6}>
            <TableSkeleton rows={6} />
          </Box>
        ) : (
          <Table>
            <Thead>
              <Tr>
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
