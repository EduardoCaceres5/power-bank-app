import { useState } from 'react';
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
import type { AddCabinetRequest } from '@/types/api.types';

interface AddCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCabinetModal({ isOpen, onClose, onSuccess }: AddCabinetModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddCabinetRequest>({
    cabinet_id: '',
    qrcode: '',
    model: 'pm8',
    sim: '',
  });

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.addCabinet(formData);
      if (response.success) {
        toast({
          title: 'Gabinete agregado exitosamente',
          status: 'success',
          duration: 3000,
        });
        onSuccess();
        onClose();
        setFormData({ cabinet_id: '', qrcode: '', model: 'pm8', sim: '' });
      }
    } catch (err) {
      toast({
        title: 'Error al agregar gabinete',
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
          <ModalHeader>Agregar Nuevo Gabinete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ID de Gabinete</FormLabel>
                <Input
                  value={formData.cabinet_id}
                  onChange={(e) => setFormData({ ...formData, cabinet_id: e.target.value })}
                  placeholder="CT123456789"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Código QR</FormLabel>
                <Input
                  value={formData.qrcode}
                  onChange={(e) => setFormData({ ...formData, qrcode: e.target.value })}
                  placeholder="QR123456"
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
                  placeholder="1234567890"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={loading}>
              Agregar Gabinete
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
