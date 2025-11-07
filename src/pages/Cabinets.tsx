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
} from '@chakra-ui/react';
import { MdAdd, MdEdit, MdDelete, MdMoreVert, MdRefresh, MdPowerSettingsNew, MdDevices } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Cabinet } from '@/types/api.types';
import AddCabinetModal from '@/components/cabinets/AddCabinetModal';
import EditCabinetModal from '@/components/cabinets/EditCabinetModal';
import DeleteCabinetDialog from '@/components/cabinets/DeleteCabinetDialog';

export default function Cabinets() {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    is_online: '' as '' | '0' | '1',
    cabinet_id: '',
  });

  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);

  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteDialog = useDisclosure();

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

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
        setCabinets(response.data.list);
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

  return (
    <Box>
      {/* Filters and Actions */}
      <Flex mb={6} gap={4} wrap="wrap" align="center" justify="space-between">
        <HStack spacing={3}>
          <Input
            placeholder="Buscar por ID de Gabinete"
            value={filters.cabinet_id}
            onChange={(e) => setFilters({ ...filters, cabinet_id: e.target.value })}
            maxW="250px"
          />
          <Select
            value={filters.is_online}
            onChange={(e) => setFilters({ ...filters, is_online: e.target.value as '' | '0' | '1' })}
            maxW="150px"
          >
            <option value="">Todos los Estados</option>
            <option value="1">En Línea</option>
            <option value="0">Fuera de Línea</option>
          </Select>
          <IconButton
            aria-label="Actualizar"
            icon={<MdRefresh />}
            onClick={loadCabinets}
            variant="ghost"
          />
        </HStack>

        <Button leftIcon={<MdAdd />} colorScheme="brand" onClick={addModal.onOpen}>
          Agregar Gabinete
        </Button>
      </Flex>

      {/* Cabinets Table */}
      <Box bg={bgColor} borderRadius="lg" shadow="sm" borderWidth="1px" overflow="hidden">
        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner size="xl" color="brand.500" />
          </Flex>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : cabinets.length === 0 ? (
          <Flex justify="center" align="center" h="400px" direction="column">
            <MdDevices size={48} color="gray" />
            <Box mt={4} color="gray.500">
              No se encontraron gabinetes
            </Box>
          </Flex>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID Gabinete</Th>
                <Th>Modelo</Th>
                <Th>Código QR</Th>
                <Th>Estado</Th>
                <Th>SIM</Th>
                <Th>Dirección</Th>
                <Th>Creado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cabinets.map((cabinet) => (
                <Tr key={cabinet.id}>
                  <Td fontWeight="medium">{cabinet.cabinet_id}</Td>
                  <Td>
                    <Badge colorScheme="blue">{cabinet.model.toUpperCase()}</Badge>
                  </Td>
                  <Td>{cabinet.qrcode}</Td>
                  <Td>
                    <Badge colorScheme={cabinet.is_online === 1 ? 'green' : 'red'}>
                      {cabinet.is_online === 1 ? 'En Línea' : 'Fuera de Línea'}
                    </Badge>
                  </Td>
                  <Td>{cabinet.sim || '-'}</Td>
                  <Td>{cabinet.address || '-'}</Td>
                  <Td>{new Date(cabinet.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Acciones"
                        icon={<MdMoreVert />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
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

      {/* Modals */}
      <AddCabinetModal isOpen={addModal.isOpen} onClose={addModal.onClose} onSuccess={loadCabinets} />
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
        </>
      )}
    </Box>
  );
}
