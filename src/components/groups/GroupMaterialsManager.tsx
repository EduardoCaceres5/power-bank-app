import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  Text,
  Badge,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdAdd, MdDelete, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Material, GroupMaterialDetail } from '@/types/api.types';

interface GroupMaterialsManagerProps {
  value: GroupMaterialDetail[];
  onChange: (materials: GroupMaterialDetail[]) => void;
}

export function GroupMaterialsManager({ value, onChange }: GroupMaterialsManagerProps) {
  const toast = useToast();
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | ''>('');
  const [duration, setDuration] = useState<number>(5);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMaterials({ page: 1 });
      if (response.success && response.data) {
        setAvailableMaterials(response.data.list);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los materiales',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = () => {
    if (!selectedMaterialId) {
      toast({
        title: 'Selecciona un material',
        description: 'Debes seleccionar un material antes de agregarlo',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Check if material is already added
    if (value.some((m) => m.material_id === selectedMaterialId)) {
      toast({
        title: 'Material ya agregado',
        description: 'Este material ya está en el grupo',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const newMaterials = [
      ...value,
      {
        material_id: Number(selectedMaterialId),
        sort: value.length + 1,
        time: duration,
      },
    ];

    onChange(newMaterials);
    setSelectedMaterialId('');
    setDuration(5);
  };

  const removeMaterial = (index: number) => {
    const newMaterials = value.filter((_, i) => i !== index);
    // Recalculate sort order
    const reordered = newMaterials.map((m, i) => ({ ...m, sort: i + 1 }));
    onChange(reordered);
  };

  const moveMaterial = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }

    const newMaterials = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newMaterials[index], newMaterials[targetIndex]] = [
      newMaterials[targetIndex],
      newMaterials[index],
    ];

    // Recalculate sort order
    const reordered = newMaterials.map((m, i) => ({ ...m, sort: i + 1 }));
    onChange(reordered);
  };

  const updateDuration = (index: number, time: number) => {
    const newMaterials = [...value];
    newMaterials[index] = { ...newMaterials[index], time };
    onChange(newMaterials);
  };

  const getMaterialById = (id: number): Material | undefined => {
    return availableMaterials.find((m) => m.id === id);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <FormLabel>Agregar Materiales al Grupo</FormLabel>
        <HStack>
          <FormControl flex="1">
            <Select
              placeholder="Seleccionar material"
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value ? Number(e.target.value) : '')}
              isDisabled={loading}
            >
              {availableMaterials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name || `Material ${material.id}`} ({material.type})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl width="150px">
            <NumberInput
              value={duration}
              onChange={(_, val) => setDuration(val)}
              min={1}
              max={300}
            >
              <NumberInputField placeholder="Duración (seg)" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <Button leftIcon={<MdAdd />} colorScheme="blue" onClick={addMaterial} minW="120px">
            Agregar
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontWeight="semibold" mb={2}>
          Materiales en el Grupo ({value.length})
        </Text>

        {value.length === 0 ? (
          <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
            <Text color="gray.500">No hay materiales en este grupo</Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Agrega materiales usando el formulario de arriba
            </Text>
          </Box>
        ) : (
          <VStack spacing={2} align="stretch">
            {value.map((groupMaterial, index) => {
              const material = getMaterialById(groupMaterial.material_id);
              return (
                <Box
                  key={index}
                  p={3}
                  bg="white"
                  borderWidth="1px"
                  borderRadius="md"
                  shadow="sm"
                >
                  <HStack spacing={3}>
                    <VStack spacing={1}>
                      <IconButton
                        aria-label="Subir"
                        icon={<MdArrowUpward />}
                        size="xs"
                        variant="ghost"
                        onClick={() => moveMaterial(index, 'up')}
                        isDisabled={index === 0}
                      />
                      <IconButton
                        aria-label="Bajar"
                        icon={<MdArrowDownward />}
                        size="xs"
                        variant="ghost"
                        onClick={() => moveMaterial(index, 'down')}
                        isDisabled={index === value.length - 1}
                      />
                    </VStack>

                    <Badge colorScheme="blue" fontSize="md" px={2}>
                      {groupMaterial.sort}
                    </Badge>

                    {material && material.type === 'image' && (
                      <Image
                        src={material.file}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    )}

                    <VStack align="start" flex="1" spacing={0}>
                      <Text fontWeight="medium">
                        {material?.name || `Material ${groupMaterial.material_id}`}
                      </Text>
                      <HStack>
                        <Badge colorScheme={material?.type === 'image' ? 'blue' : 'purple'}>
                          {material?.type === 'image' ? 'Imagen' : 'Video'}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          ID: {groupMaterial.material_id}
                        </Text>
                      </HStack>
                    </VStack>

                    <FormControl width="120px">
                      <HStack>
                        <NumberInput
                          value={groupMaterial.time}
                          onChange={(_, val) => updateDuration(index, val)}
                          min={1}
                          max={300}
                          size="sm"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Text fontSize="sm" whiteSpace="nowrap">
                          seg
                        </Text>
                      </HStack>
                    </FormControl>

                    <IconButton
                      aria-label="Eliminar"
                      icon={<MdDelete />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeMaterial(index)}
                    />
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
