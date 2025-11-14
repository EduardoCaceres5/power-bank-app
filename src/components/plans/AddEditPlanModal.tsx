import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { AddPlanRequest, PlanDetail } from '@/types/api.types';
import { PlanScheduleManager } from './PlanScheduleManager';
import { CabinetSelector } from './CabinetSelector';

interface AddEditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planId?: number | null;
}

export function AddEditPlanModal({ isOpen, onClose, onSuccess, planId }: AddEditPlanModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formData, setFormData] = useState<AddPlanRequest>({
    plan_name: '',
    start_date: '',
    end_date: '',
    equipment_group: '',
    details: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!planId;

  useEffect(() => {
    if (isOpen && planId) {
      loadPlanDetails(planId);
    } else if (isOpen) {
      // Reset form for add mode
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        plan_name: '',
        start_date: today,
        end_date: today,
        equipment_group: '',
        details: [],
      });
      setErrors({});
    }
  }, [isOpen, planId]);

  const loadPlanDetails = async (id: number) => {
    try {
      setLoadingDetails(true);
      const response = await apiService.getPlanDetail(id);

      if (response.success && response.data) {
        setFormData({
          plan_name: response.data.plan_name,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          equipment_group: response.data.equipment_group,
          details: response.data.details.map((d) => ({
            start_hour: d.start_hour,
            start_minute: d.start_minute,
            end_hour: d.end_hour,
            end_minute: d.end_minute,
            group_id: d.group_id,
          })),
        });
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo cargar el plan',
        status: 'error',
        duration: 5000,
      });
      onClose();
    } finally {
      setLoadingDetails(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.plan_name.trim()) {
      newErrors.plan_name = 'El nombre es requerido';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La fecha de fin es requerida';
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start > end) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (!formData.equipment_group || formData.equipment_group.trim() === '') {
      newErrors.equipment_group = 'Debes seleccionar al menos un gabinete';
    }

    if (formData.details.length === 0) {
      newErrors.details = 'Debes agregar al menos un horario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && planId) {
        const response = await apiService.updatePlan(planId, formData);

        if (response.success) {
          toast({
            title: 'Plan actualizado',
            description: 'El plan se ha actualizado exitosamente',
            status: 'success',
            duration: 3000,
          });
        }
      } else {
        const response = await apiService.addPlan(formData);

        if (response.success) {
          toast({
            title: 'Plan creado',
            description: 'El plan se ha creado exitosamente',
            status: 'success',
            duration: 3000,
          });
        }
      }

      handleClose();
      onSuccess();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : `No se pudo ${isEditMode ? 'actualizar' : 'crear'} el plan`,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      plan_name: '',
      start_date: today,
      end_date: today,
      equipment_group: '',
      details: [],
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Editar Plan' : 'Agregar Plan'}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loadingDetails ? (
            <VStack py={8}>
              <Button isLoading loadingText="Cargando plan..." variant="ghost" />
            </VStack>
          ) : (
            <VStack spacing={5} align="stretch">
              <FormControl isRequired isInvalid={!!errors.plan_name}>
                <FormLabel>Nombre del Plan</FormLabel>
                <Input
                  placeholder="Ej: Plan Promocional Diciembre"
                  value={formData.plan_name}
                  onChange={(e) => {
                    setFormData({ ...formData, plan_name: e.target.value });
                    if (errors.plan_name) {
                      setErrors({ ...errors, plan_name: '' });
                    }
                  }}
                />
                <FormErrorMessage>{errors.plan_name}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={!!errors.start_date}>
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => {
                      setFormData({ ...formData, start_date: e.target.value });
                      if (errors.start_date) {
                        setErrors({ ...errors, start_date: '' });
                      }
                    }}
                  />
                  <FormErrorMessage>{errors.start_date}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.end_date}>
                  <FormLabel>Fecha de Fin</FormLabel>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => {
                      setFormData({ ...formData, end_date: e.target.value });
                      if (errors.end_date) {
                        setErrors({ ...errors, end_date: '' });
                      }
                    }}
                  />
                  <FormErrorMessage>{errors.end_date}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={!!errors.equipment_group}>
                <CabinetSelector
                  value={formData.equipment_group}
                  onChange={(equipmentGroup) => {
                    setFormData({ ...formData, equipment_group: equipmentGroup });
                    if (errors.equipment_group) {
                      setErrors({ ...errors, equipment_group: '' });
                    }
                  }}
                />
                <FormErrorMessage>{errors.equipment_group}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.details}>
                <PlanScheduleManager
                  value={formData.details}
                  onChange={(details) => {
                    setFormData({ ...formData, details });
                    if (errors.details) {
                      setErrors({ ...errors, details: '' });
                    }
                  }}
                />
                <FormErrorMessage>{errors.details}</FormErrorMessage>
              </FormControl>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={loadingDetails}
          >
            {isEditMode ? 'Actualizar Plan' : 'Crear Plan'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
