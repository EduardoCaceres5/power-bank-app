import { useState, useEffect } from 'react';
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
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { apiService } from '@/services/api';
import type { Cabinet } from '@/types/api.types';

interface EditCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinet: Cabinet;
  onSuccess: () => void;
}

export default function EditCabinetModal({
  isOpen,
  onClose,
  cabinet,
  onSuccess,
}: EditCabinetModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    qrcode: cabinet.qrcode,
    model: cabinet.model,
    sim: cabinet.sim || '',
  });

  const toast = useToast();

  useEffect(() => {
    setFormData({
      qrcode: cabinet.qrcode,
      model: cabinet.model,
      sim: cabinet.sim || '',
    });
  }, [cabinet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.updateCabinet(cabinet.cabinet_id, formData);
      if (response.success) {
        toast({
          title: 'Gabinete actualizado exitosamente',
          status: 'success',
          duration: 3000,
        });
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast({
        title: 'Error al actualizar gabinete',
        description: err instanceof Error ? err.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Editar Gabinete: {cabinet.cabinet_id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Código QR</FormLabel>
                <Input
                  value={formData.qrcode}
                  onChange={(e) => setFormData({ ...formData, qrcode: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Modelo</FormLabel>
                <Select
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value as 'pm8' | 'pm12' | 'pm20' })
                  }
                >
                  <option value="pm8">PM8 (8 ranuras)</option>
                  <option value="pm12">PM12 (12 ranuras)</option>
                  <option value="pm20">PM20 (20 ranuras)</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Número de Tarjeta SIM</FormLabel>
                <Input
                  value={formData.sim}
                  onChange={(e) => setFormData({ ...formData, sim: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={loading}>
              Actualizar Gabinete
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
