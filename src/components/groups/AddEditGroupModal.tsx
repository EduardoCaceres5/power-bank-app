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
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { AddGroupRequest, GroupDetail, GroupMaterialDetail } from '@/types/api.types';
import { GroupMaterialsManager } from './GroupMaterialsManager';

interface AddEditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId?: number | null;
}

export function AddEditGroupModal({
  isOpen,
  onClose,
  onSuccess,
  groupId,
}: AddEditGroupModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formData, setFormData] = useState<AddGroupRequest>({
    name: '',
    details: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!groupId;

  useEffect(() => {
    if (isOpen && groupId) {
      loadGroupDetails(groupId);
    } else if (isOpen) {
      // Reset form for add mode
      setFormData({ name: '', details: [] });
      setErrors({});
    }
  }, [isOpen, groupId]);

  const loadGroupDetails = async (id: number) => {
    try {
      setLoadingDetails(true);
      const response = await apiService.getGroupDetail(id);

      if (response.success && response.data) {
        setFormData({
          name: response.data.group_name,
          details: response.data.details.map((d) => ({
            material_id: d.material_id,
            sort: d.sort,
            time: d.time,
          })),
        });
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo cargar el grupo',
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.details.length === 0) {
      newErrors.details = 'Debes agregar al menos un material';
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

      if (isEditMode && groupId) {
        const response = await apiService.updateGroup(groupId, formData);

        if (response.success) {
          toast({
            title: 'Grupo actualizado',
            description: 'El grupo se ha actualizado exitosamente',
            status: 'success',
            duration: 3000,
          });
        }
      } else {
        const response = await apiService.addGroup(formData);

        if (response.success) {
          toast({
            title: 'Grupo creado',
            description: 'El grupo se ha creado exitosamente',
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
            : `No se pudo ${isEditMode ? 'actualizar' : 'crear'} el grupo`,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', details: [] });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Editar Grupo' : 'Agregar Grupo'}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loadingDetails ? (
            <VStack py={8}>
              <Button isLoading loadingText="Cargando grupo..." variant="ghost" />
            </VStack>
          ) : (
            <VStack spacing={5} align="stretch">
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Nombre del Grupo</FormLabel>
                <Input
                  placeholder="Ej: Grupo Promocional 1"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.details}>
                <GroupMaterialsManager
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
            {isEditMode ? 'Actualizar Grupo' : 'Crear Grupo'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
