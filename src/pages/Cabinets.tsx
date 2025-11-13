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
  HStack,
  useColorModeValue,
  useDisclosure,
  useToast,
  Flex,
  Input,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdRefresh,
  MdPowerSettingsNew,
  MdDevices,
  MdVisibility,
  MdDeviceHub,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import type { Cabinet } from '@/types/api.types';
import AddCabinetModal from '@/components/cabinets/AddCabinetModal';
import EditCabinetModal from '@/components/cabinets/EditCabinetModal';
import DeleteCabinetDialog from '@/components/cabinets/DeleteCabinetDialog';
import DeviceRegistrationModal from '@/components/cabinets/DeviceRegistrationModal';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { ResponsiveCabinetCard } from '@/components/common/ResponsiveTable';
import { Pagination } from '@/components/common/Pagination';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { normalizeCabinet } from '@/utils/cabinet';

export default function Cabinets() {
  const navigate = useNavigate();
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  console.log('🚀 ~ cabinets:', cabinets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    is_online: '' as '' | '0' | '1',
    cabinet_id: '',
  });

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);

  // Feature flag para registro de dispositivos
  const enableDeviceRegistration = import.meta.env.VITE_ENABLE_DEVICE_REGISTRATION === 'true';

  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const deviceRegModal = useDisclosure();

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.400');
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    loadCabinets();
  }, [page, filters]);

  const loadCabinets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        page,
        page_size: 20,
      };

      if (filters.is_online !== '') {
        params.is_online = parseInt(filters.is_online);
      }
      if (filters.cabinet_id) {
        params.cabinet_id = filters.cabinet_id;
      }

      const response = await apiService.getCabinets(params);

      if (response.success && response.data) {
        setCabinets(response.data.list.map((item) => normalizeCabinet(item)));
        setTotal(response.data.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar gabinetes');
      toast({
        title: 'Error al cargar gabinetes',
        description: err instanceof Error ? err.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestartCabinet = async (cabinetId: string) => {
    try {
      const response = await apiService.restartCabinet(cabinetId);
      if (response.success) {
        toast({
          title: 'Comando de reinicio enviado',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: 'Error al reiniciar gabinete',
        description: err instanceof Error ? err.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleEdit = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    editModal.onOpen();
  };

  const handleDelete = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    deleteDialog.onOpen();
  };

  const handleDeleteSuccess = () => {
    loadCabinets();
    deleteDialog.onClose();
  };

  const handleRegisterDevice = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    deviceRegModal.onOpen();
  };

  const handleViewDetails = (cabinetId: string) => {
    navigate(`/cabinets/${cabinetId}`);
  };

  const formatTimestampToAsuncion = (timestampInSeconds?: number) => {
    if (typeof timestampInSeconds !== 'number' || !timestampInSeconds) {
      return '-';
    }
    const date = new Date(timestampInSeconds * 1000);

    return date.toLocaleString('es-PY');
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Filters and Actions */}
      <Flex mb={6} gap={4} wrap="wrap" align="center" justify="space-between">
        <HStack spacing={3}>
          <Input
            placeholder="Buscar por ID de Gabinete"
            value={filters.cabinet_id}
            onChange={(e) => setFilters({ ...filters, cabinet_id: e.target.value })}
            minW="220px"
            maxW="250px"
          />
          <Select
            value={filters.is_online}
            onChange={(e) =>
              setFilters({ ...filters, is_online: e.target.value as '' | '0' | '1' })
            }
            minW="150px"
            maxW="200px"
          >
            <option value="">Todos los Estados</option>
            <option value="1">En Línea</option>
            <option value="0">Fuera de Línea</option>
          </Select>
          <IconButton
            aria-label="Actualizar lista de gabinetes"
            icon={<MdRefresh />}
            onClick={loadCabinets}
            variant="ghost"
            _focusVisible={{
              outline: '2px solid',
              outlineColor: 'brand.500',
              outlineOffset: '2px',
            }}
          />
        </HStack>

        <Button
          leftIcon={<MdAdd />}
          colorScheme="brand"
          onClick={addModal.onOpen}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'brand.600',
            outlineOffset: '2px',
          }}
        >
          Agregar Gabinete
        </Button>
      </Flex>

      {/* Cabinets Table */}
      <Box
        bg={bgColor}
        borderRadius="lg"
        shadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        {loading ? (
          <Box p={6}>
            <TableSkeleton rows={10} />
          </Box>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : cabinets.length === 0 ? (
          <Flex justify="center" align="center" h="400px" direction="column">
            <MdDevices size={48} opacity={0.5} />
            <Box mt={4} color={emptyStateColor}>
              No se encontraron gabinetes
            </Box>
          </Flex>
        ) : isMobile ? (
          <VStack spacing={3} p={4}>
            {cabinets.map((cabinet) => (
              <ResponsiveCabinetCard
                key={cabinet.id}
                cabinet={cabinet}
                onClick={() => handleViewDetails(cabinet.cabinet_id)}
              />
            ))}
          </VStack>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID Gabinete</Th>
                <Th>Modelo</Th>
                <Th>Estado</Th>
                <Th>IP</Th>
                <Th>Último Ping</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cabinets.map((cabinet) => (
                <Tr
                  key={cabinet.id}
                  _hover={{ bg: hoverBg, cursor: 'pointer' }}
                  onClick={() => handleViewDetails(cabinet.cabinet_id)}
                  transition="background-color 0.2s"
                >
                  <Td fontWeight="medium">{cabinet.cabinet_id}</Td>
                  <Td>
                    <Badge colorScheme="blue">{cabinet.model.toUpperCase()}</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={cabinet.is_online === 1 ? 'green' : 'red'}>
                      {cabinet.is_online === 1 ? 'En Línea' : 'Fuera de Línea'}
                    </Badge>
                  </Td>
                  <Td fontSize="sm" color={textSecondary}>
                    {cabinet.ip}
                  </Td>

                  <Td fontSize="sm" color={textSecondary}>
                    {formatTimestampToAsuncion(cabinet.heart_time)}
                  </Td>

                  <Td onClick={(e) => e.stopPropagation()}>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Acciones"
                        icon={<MdMoreVert />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<MdVisibility />}
                          onClick={() => handleViewDetails(cabinet.cabinet_id)}
                        >
                          Ver Detalles
                        </MenuItem>
                        {enableDeviceRegistration && !cabinet.deviceId && (
                          <MenuItem
                            icon={<MdDeviceHub />}
                            onClick={() => handleRegisterDevice(cabinet)}
                          >
                            Registrar Dispositivo
                          </MenuItem>
                        )}
                        <MenuItem icon={<MdEdit />} onClick={() => handleEdit(cabinet)}>
                          Editar
                        </MenuItem>
                        <MenuItem
                          icon={<MdPowerSettingsNew />}
                          onClick={() => handleRestartCabinet(cabinet.cabinet_id)}
                        >
                          Reiniciar
                        </MenuItem>
                        <MenuItem
                          icon={<MdDelete />}
                          onClick={() => handleDelete(cabinet)}
                          color="red.500"
                        >
                          Eliminar
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination */}
      {total > 20 && (
        <Box mt={6}>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / 20)}
            onPageChange={setPage}
            pageSize={20}
            totalItems={total}
          />
        </Box>
      )}

      {/* Modals */}
      <AddCabinetModal
        isOpen={addModal.isOpen}
        onClose={addModal.onClose}
        onSuccess={loadCabinets}
      />
      {selectedCabinet && (
        <>
          <EditCabinetModal
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
            cabinet={selectedCabinet}
            onSuccess={loadCabinets}
          />
          <DeleteCabinetDialog
            isOpen={deleteDialog.isOpen}
            onClose={deleteDialog.onClose}
            cabinet={selectedCabinet}
            onSuccess={handleDeleteSuccess}
          />
          {enableDeviceRegistration && (
            <DeviceRegistrationModal
              isOpen={deviceRegModal.isOpen}
              onClose={deviceRegModal.onClose}
              onSuccess={loadCabinets}
              cabinetId={selectedCabinet.cabinet_id}
            />
          )}
        </>
      )}
    </Box>
  );
}
