import { useState } from 'react';
import { isAxiosError } from 'axios';
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
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  InputGroup,
  InputRightElement,
  IconButton,
  Code,
  Box,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CopyIcon } from '@chakra-ui/icons';
import { apiService } from '@/services/api';
import type { DeviceRegistrationRequest } from '@/types/api.types';

interface DeviceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cabinetId: string;
}

export default function DeviceRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  cabinetId,
}: DeviceRegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState<DeviceRegistrationRequest>({
    cabinetId: cabinetId,
    deviceId: '',
    deviceSecret: '',
  });

  const toast = useToast();

  const generateDeviceId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `device-${timestamp}-${random}`;
  };

  const generateDeviceSecret = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleGenerateCredentials = () => {
    setFormData({
      ...formData,
      deviceId: generateDeviceId(),
      deviceSecret: generateDeviceSecret(),
    });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copiado`,
      status: 'success',
      duration: 2000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formData.deviceSecret.length < 16) {
      toast({
        title: 'Error de validación',
        description: 'El deviceSecret debe tener mínimo 16 caracteres',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.registerDevice(formData);
      if (response.success) {
        toast({
          title: 'Dispositivo registrado exitosamente',
          description: 'Guarda las credenciales de forma segura en el dispositivo físico',
          status: 'success',
          duration: 5000,
        });
        onSuccess();
        onClose();
        setFormData({ cabinetId: '', deviceId: '', deviceSecret: '' });
      }
    } catch (err) {
      let description = 'Error desconocido';
      if (isAxiosError(err)) {
        const apiMessage = (err.response?.data as { message?: string })?.message;
        description = apiMessage || err.message;
      } else if (err instanceof Error) {
        description = err.message;
      }
      toast({
        title: 'Error al registrar dispositivo',
        description,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Registrar Dispositivo para Gabinete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Registra las credenciales del dispositivo físico para que pueda autenticarse y
                  enviar heartbeats. Guarda el deviceSecret de forma segura.
                </AlertDescription>
              </Alert>

              <FormControl>
                <FormLabel>ID de Gabinete</FormLabel>
                <Input value={cabinetId} isReadOnly bg="gray.50" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Device ID</FormLabel>
                <InputGroup>
                  <Input
                    value={formData.deviceId}
                    onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                    placeholder="device-001"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Copiar Device ID"
                      icon={<CopyIcon />}
                      size="sm"
                      onClick={() => handleCopy(formData.deviceId, 'Device ID')}
                      isDisabled={!formData.deviceId}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>
                  Device Secret{' '}
                  <Text as="span" fontSize="xs" color="gray.500">
                    (mínimo 16 caracteres)
                  </Text>
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showSecret ? 'text' : 'password'}
                    value={formData.deviceSecret}
                    onChange={(e) => setFormData({ ...formData, deviceSecret: e.target.value })}
                    placeholder="super-secret-device-key-12345"
                    fontFamily={showSecret ? 'monospace' : 'inherit'}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label="Copiar Secret"
                      icon={<CopyIcon />}
                      size="sm"
                      mr={1}
                      onClick={() => handleCopy(formData.deviceSecret, 'Device Secret')}
                      isDisabled={!formData.deviceSecret}
                    />
                    <IconButton
                      aria-label={showSecret ? 'Ocultar' : 'Mostrar'}
                      icon={showSecret ? <ViewOffIcon /> : <ViewIcon />}
                      size="sm"
                      onClick={() => setShowSecret(!showSecret)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                onClick={handleGenerateCredentials}
                variant="outline"
                colorScheme="brand"
                size="sm"
              >
                Generar Credenciales Automáticamente
              </Button>

              {formData.deviceId && formData.deviceSecret && (
                <Box borderWidth={1} borderRadius="md" p={4} bg="gray.50">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Vista previa de las credenciales:
                  </Text>
                  <VStack align="stretch" spacing={2} fontSize="xs">
                    <Box>
                      <Text color="gray.600">cabinetId:</Text>
                      <Code colorScheme="gray" display="block" p={2}>
                        {cabinetId}
                      </Code>
                    </Box>
                    <Box>
                      <Text color="gray.600">deviceId:</Text>
                      <Code colorScheme="gray" display="block" p={2}>
                        {formData.deviceId}
                      </Code>
                    </Box>
                    <Box>
                      <Text color="gray.600">deviceSecret:</Text>
                      <Code colorScheme="gray" display="block" p={2} wordBreak="break-all">
                        {formData.deviceSecret}
                      </Code>
                    </Box>
                  </VStack>
                </Box>
              )}

              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertDescription fontSize="xs">
                  <strong>Importante:</strong> El deviceSecret se almacenará hasheado en la base de
                  datos. Cópialo ahora y guárdalo de forma segura en el dispositivo físico. No
                  podrás recuperarlo después.
                </AlertDescription>
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={loading}>
              Registrar Dispositivo
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
