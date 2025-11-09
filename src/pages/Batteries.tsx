import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Flex,
  Input,
  IconButton,
  Alert,
  AlertIcon,
  Progress,
  HStack,
  Button,
} from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Battery } from '@/types/api.types';
import { TableSkeleton } from '@/components/common/SkeletonLoader';

export default function Batteries() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    loadBatteries();
  }, [page]);

  const loadBatteries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getBatteries({
        page,
        page_size: 20,
      });

      if (response.success && response.data) {
        setBatteries(response.data.list);
        setTotal(response.data.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar baterías');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatteries = batteries.filter((battery) =>
    battery.battery_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPowerColor = (power: number) => {
    if (power >= 80) return 'green';
    if (power >= 50) return 'yellow';
    if (power >= 20) return 'orange';
    return 'red';
  };

  return (
    <Box>
      {/* Filters */}
      <Flex mb={6} gap={4} align="center" justify="space-between">
        <HStack>
          <Input
            placeholder="Buscar por ID de Batería"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="300px"
          />
          <IconButton
            aria-label="Actualizar"
            icon={<MdRefresh />}
            onClick={loadBatteries}
            variant="ghost"
          />
        </HStack>
      </Flex>

      {/* Batteries Table */}
      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Box p={6}>
            <TableSkeleton rows={10} />
          </Box>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : filteredBatteries.length === 0 ? (
          <Flex justify="center" align="center" h="400px" direction="column" color="gray.500">
            No se encontraron baterías
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID Batería</Th>
                <Th>Nivel de Carga</Th>
                <Th>Estado</Th>
                <Th>Gabinete</Th>
                <Th>Ranura</Th>
                <Th>Registrada</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBatteries.map((battery) => (
                <Tr key={battery.id}>
                  <Td fontWeight="medium">{battery.battery_id}</Td>
                  <Td>
                    <Box>
                      <Progress
                        value={battery.power}
                        colorScheme={getPowerColor(battery.power)}
                        size="sm"
                        borderRadius="md"
                        mb={1}
                      />
                      <Box fontSize="xs" color="gray.500">
                        {battery.power}%
                      </Box>
                    </Box>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        battery.status === 'available'
                          ? 'green'
                          : battery.status === 'in_use'
                            ? 'blue'
                            : 'gray'
                      }
                    >
                      {battery.status}
                    </Badge>
                  </Td>
                  <Td>{battery.cabinet_id || '-'}</Td>
                  <Td>{battery.lock_id ? `Ranura ${battery.lock_id}` : '-'}</Td>
                  <Td>{new Date(battery.created_at).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination */}
      {total > 20 && (
        <Flex justify="center" mt={6}>
          <HStack>
            <Button onClick={() => setPage(page - 1)} isDisabled={page === 1} size="sm">
              Anterior
            </Button>
            <Box px={4}>
              Página {page} de {Math.ceil(total / 20)}
            </Box>
            <Button
              onClick={() => setPage(page + 1)}
              isDisabled={page >= Math.ceil(total / 20)}
              size="sm"
            >
              Siguiente
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}
