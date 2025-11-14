import {
  Box,
  FormLabel,
  VStack,
  Checkbox,
  CheckboxGroup,
  Text,
  useToast,
  useColorModeValue,
  SimpleGrid,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { Cabinet } from '@/types/api.types';

interface CabinetSelectorProps {
  value: string; // Comma-separated cabinet IDs
  onChange: (equipmentGroup: string) => void;
}

export function CabinetSelector({ value, onChange }: CabinetSelectorProps) {
  const toast = useToast();
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(false);

  const emptyBgColor = useColorModeValue('gray.50', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const checkboxBg = useColorModeValue('white', 'gray.700');
  const checkboxBorder = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadCabinets();
  }, []);

  const loadCabinets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCabinets({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setCabinets(response.data.list);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los gabinetes',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedIds = value ? value.split(',').filter(Boolean) : [];

  const handleChange = (newValues: string[]) => {
    onChange(newValues.join(','));
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="sm" />
        <Text fontSize="sm" mt={2} color="gray.500">
          Cargando gabinetes...
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      <FormLabel mb={0}>Seleccionar Gabinetes</FormLabel>
      {cabinets.length === 0 ? (
        <Box p={4} bg={emptyBgColor} borderRadius="md" textAlign="center">
          <Text color={emptyTextColor}>No hay gabinetes disponibles</Text>
        </Box>
      ) : (
        <CheckboxGroup value={selectedIds} onChange={handleChange}>
          <SimpleGrid columns={[1, 2, 3]} spacing={2}>
            {cabinets.map((cabinet) => (
              <Box
                key={cabinet.id}
                p={2}
                bg={checkboxBg}
                borderWidth="1px"
                borderColor={checkboxBorder}
                borderRadius="md"
              >
                <Checkbox value={String(cabinet.id)}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium">
                      {cabinet.equipment_name || `Gabinete ${cabinet.id}`}
                    </Text>
                    <HStack spacing={2} fontSize="xs" color="gray.500">
                      <Text>ID: {cabinet.id}</Text>
                      {cabinet.equipment_sn && <Text>SN: {cabinet.equipment_sn}</Text>}
                    </HStack>
                  </VStack>
                </Checkbox>
              </Box>
            ))}
          </SimpleGrid>
        </CheckboxGroup>
      )}
      {selectedIds.length > 0 && (
        <Text fontSize="sm" color="gray.500">
          {selectedIds.length} gabinete{selectedIds.length !== 1 ? 's' : ''} seleccionado
          {selectedIds.length !== 1 ? 's' : ''}
        </Text>
      )}
    </VStack>
  );
}
