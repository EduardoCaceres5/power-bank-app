import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { DeviceInfo } from '@/types/api.types';

interface CreateRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cabinetId: string;
  slots: DeviceInfo[];
  availableSlots: number[];
}

export default function CreateRentalModal({
  isOpen,
  onClose,
  onSuccess,
  cabinetId,
  slots,
  availableSlots,
}: CreateRentalModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | ''>('');
  const [userEmail, setUserEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'pagopar' | 'stripe'>('manual');

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setSelectedSlot('');
      setUserEmail('');
      setPaymentMethod('manual');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedSlot) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una ranura',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.createRental({
        cabinetId,
        slotNumber: Number(selectedSlot),
        paymentMethod,
        ...(userEmail && { userId: userEmail }),
      });

      if (response.success) {
        toast({
          title: 'Alquiler creado',
          description: 'El alquiler se ha creado exitosamente',
          status: 'success',
          duration: 3000,
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Error creating rental:', error);
      toast({
        title: 'Error al crear alquiler',
        description: error.response?.data?.error || error.message || 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSlotInfo = (slotNumber: number) => {
    const slot = slots.find((s) => s.lock === slotNumber);
    if (!slot || !slot.bid) return null;
    return slot;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Alquiler de Batería</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                Crea un nuevo alquiler de batería seleccionando una ranura con batería disponible.
              </AlertDescription>
            </Alert>

            <FormControl isRequired>
              <FormLabel>Ranura</FormLabel>
              <Select
                placeholder="Selecciona una ranura"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value ? Number(e.target.value) : '')}
              >
                {availableSlots.map((slotNumber) => {
                  const slotInfo = getSlotInfo(slotNumber);
                  return (
                    <option key={slotNumber} value={slotNumber}>
                      Ranura #{slotNumber}
                      {slotInfo ? ` - Batería ${slotInfo.power}%` : ''}
                    </option>
                  );
                })}
              </Select>
              {selectedSlot && getSlotInfo(Number(selectedSlot)) && (
                <HStack mt={2} spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Batería ID:
                  </Text>
                  <Badge colorScheme="green">{getSlotInfo(Number(selectedSlot))?.bid}</Badge>
                  <Badge colorScheme="blue">{getSlotInfo(Number(selectedSlot))?.power}%</Badge>
                </HStack>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>
                Email del Usuario{' '}
                <Text as="span" fontSize="sm" color="gray.500">
                  (opcional)
                </Text>
              </FormLabel>
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Deja vacío para usar tu propia cuenta
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Método de Pago</FormLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <option value="manual">Manual (Sin pago)</option>
                <option value="pagopar">Pagopar (Próximamente)</option>
                <option value="stripe">Stripe (Próximamente)</option>
              </Select>
              {paymentMethod === 'manual' && (
                <Text fontSize="xs" color="orange.500" mt={1}>
                  ⚠️ Alquiler gratuito - Solo para administradores
                </Text>
              )}
              {(paymentMethod === 'pagopar' || paymentMethod === 'stripe') && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Esta opción estará disponible próximamente
                </Text>
              )}
            </FormControl>

            {availableSlots.length === 0 && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  No hay baterías disponibles en este gabinete
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!selectedSlot || availableSlots.length === 0}
          >
            Crear Alquiler
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
