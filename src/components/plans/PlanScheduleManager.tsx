import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  Text,
  Badge,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { Group, PlanScheduleDetail } from '@/types/api.types';

interface PlanScheduleManagerProps {
  value: Omit<PlanScheduleDetail, 'group_name'>[];
  onChange: (schedules: Omit<PlanScheduleDetail, 'group_name'>[]) => void;
}

export function PlanScheduleManager({ value, onChange }: PlanScheduleManagerProps) {
  const toast = useToast();
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | ''>('');
  const [startHour, setStartHour] = useState<number>(0);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(23);
  const [endMinute, setEndMinute] = useState<number>(59);

  const emptyBgColor = useColorModeValue('gray.50', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const emptyDescColor = useColorModeValue('gray.400', 'gray.500');
  const scheduleCardBg = useColorModeValue('white', 'gray.700');
  const scheduleCardBorderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroups({ page: 1 });
      if (response.success && response.data) {
        setAvailableGroups(response.data.list);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los grupos',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const addSchedule = () => {
    if (!selectedGroupId) {
      toast({
        title: 'Selecciona un grupo',
        description: 'Debes seleccionar un grupo antes de agregarlo',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Validate time range
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (startTotalMinutes >= endTotalMinutes) {
      toast({
        title: 'Horario inválido',
        description: 'La hora de fin debe ser posterior a la hora de inicio',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Check for overlapping schedules with the same group
    const hasOverlap = value.some((schedule) => {
      if (schedule.group_id !== selectedGroupId) return false;

      const scheduleStart = schedule.start_hour * 60 + schedule.start_minute;
      const scheduleEnd = schedule.end_hour * 60 + schedule.end_minute;

      return (
        (startTotalMinutes >= scheduleStart && startTotalMinutes < scheduleEnd) ||
        (endTotalMinutes > scheduleStart && endTotalMinutes <= scheduleEnd) ||
        (startTotalMinutes <= scheduleStart && endTotalMinutes >= scheduleEnd)
      );
    });

    if (hasOverlap) {
      toast({
        title: 'Horario solapado',
        description: 'Este grupo ya tiene un horario que se solapa con el que intentas agregar',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const newSchedules = [
      ...value,
      {
        start_hour: startHour,
        start_minute: startMinute,
        end_hour: endHour,
        end_minute: endMinute,
        group_id: Number(selectedGroupId),
      },
    ];

    onChange(newSchedules);
    setSelectedGroupId('');
    setStartHour(0);
    setStartMinute(0);
    setEndHour(23);
    setEndMinute(59);
  };

  const removeSchedule = (index: number) => {
    const newSchedules = value.filter((_, i) => i !== index);
    onChange(newSchedules);
  };

  const getGroupById = (id: number): Group | undefined => {
    return availableGroups.find((g) => g.id === id);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <FormLabel>Agregar Horarios al Plan</FormLabel>
        <VStack spacing={3} align="stretch">
          <HStack>
            <FormControl flex="1">
              <FormLabel fontSize="sm">Grupo</FormLabel>
              <Select
                placeholder="Seleccionar grupo"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : '')}
                isDisabled={loading}
              >
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          <HStack>
            <FormControl>
              <FormLabel fontSize="sm">Hora de Inicio</FormLabel>
              <HStack>
                <NumberInput
                  value={startHour}
                  onChange={(_, val) => setStartHour(val)}
                  min={0}
                  max={23}
                  size="sm"
                >
                  <NumberInputField placeholder="HH" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text>:</Text>
                <NumberInput
                  value={startMinute}
                  onChange={(_, val) => setStartMinute(val)}
                  min={0}
                  max={59}
                  size="sm"
                >
                  <NumberInputField placeholder="MM" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Hora de Fin</FormLabel>
              <HStack>
                <NumberInput
                  value={endHour}
                  onChange={(_, val) => setEndHour(val)}
                  min={0}
                  max={23}
                  size="sm"
                >
                  <NumberInputField placeholder="HH" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text>:</Text>
                <NumberInput
                  value={endMinute}
                  onChange={(_, val) => setEndMinute(val)}
                  min={0}
                  max={59}
                  size="sm"
                >
                  <NumberInputField placeholder="MM" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </FormControl>

            <Button
              leftIcon={<MdAdd />}
              colorScheme="blue"
              onClick={addSchedule}
              alignSelf="flex-end"
              size="sm"
            >
              Agregar
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Box>
        <Text fontWeight="semibold" mb={2}>
          Horarios del Plan ({value.length})
        </Text>

        {value.length === 0 ? (
          <Box p={4} bg={emptyBgColor} borderRadius="md" textAlign="center">
            <Text color={emptyTextColor}>No hay horarios en este plan</Text>
            <Text fontSize="sm" color={emptyDescColor} mt={1}>
              Agrega horarios usando el formulario de arriba
            </Text>
          </Box>
        ) : (
          <VStack spacing={2} align="stretch">
            {value.map((schedule, index) => {
              const group = getGroupById(schedule.group_id);
              return (
                <Box
                  key={index}
                  p={3}
                  bg={scheduleCardBg}
                  borderWidth="1px"
                  borderColor={scheduleCardBorderColor}
                  borderRadius="md"
                  shadow="sm"
                >
                  <HStack spacing={3} justify="space-between">
                    <VStack align="start" flex="1" spacing={1}>
                      <HStack>
                        <Text fontWeight="medium">{group?.group_name || `Grupo ${schedule.group_id}`}</Text>
                        <Badge colorScheme="blue">ID: {schedule.group_id}</Badge>
                      </HStack>
                      <HStack spacing={2}>
                        <Badge colorScheme="green" fontSize="sm">
                          {formatTime(schedule.start_hour, schedule.start_minute)}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          hasta
                        </Text>
                        <Badge colorScheme="red" fontSize="sm">
                          {formatTime(schedule.end_hour, schedule.end_minute)}
                        </Badge>
                      </HStack>
                    </VStack>

                    <IconButton
                      aria-label="Eliminar"
                      icon={<MdDelete />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeSchedule(index)}
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
