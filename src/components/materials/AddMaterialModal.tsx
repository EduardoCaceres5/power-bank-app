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
  FormErrorMessage,
  RadioGroup,
  Radio,
  HStack,
  Text,
  Box,
  Icon,
  Divider,
  Progress,
  Image,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { MdCloudUpload, MdLink, MdCheckCircle } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { AddMaterialRequest } from '@/types/api.types';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type UploadMode = 'url' | 'upload';

export function AddMaterialModal({ isOpen, onClose, onSuccess }: AddMaterialModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AddMaterialRequest>({
    name: '',
    path: '',
    type: 'image',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.path.trim()) {
      newErrors.path = uploadMode === 'url' ? 'La URL es requerida' : 'Debes seleccionar un archivo';
    } else if (!formData.path.startsWith('https://')) {
      newErrors.path = 'La URL debe comenzar con https://';
    }

    if (!formData.type) {
      newErrors.type = 'El tipo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModeChange = (mode: UploadMode) => {
    setUploadMode(mode);
    setFormData({ ...formData, path: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setErrors({});
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if ((formData.type === 'image' && !isImage) || (formData.type === 'video' && !isVideo)) {
      toast({
        title: 'Tipo de archivo incorrecto',
        description: `Por favor selecciona un archivo de tipo ${formData.type === 'image' ? 'imagen' : 'video'}`,
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'El tamaño máximo permitido es 50MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setSelectedFile(file);

    // Generate preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }

    if (errors.path) {
      setErrors({ ...errors, path: '' });
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      setErrors({ ...errors, path: 'Debes seleccionar un archivo' });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate progress (since we don't have real progress from axios)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.uploadMaterialFile(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data) {
        setFormData({ ...formData, path: response.data.url });
        toast({
          title: 'Archivo subido',
          description: 'El archivo se ha subido exitosamente',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error: unknown) {
      toast({
        title: 'Error al subir',
        description: error instanceof Error ? error.message : 'No se pudo subir el archivo',
        status: 'error',
        duration: 5000,
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // If upload mode and file not uploaded yet, upload first
    if (uploadMode === 'upload' && selectedFile && !formData.path) {
      await handleUploadFile();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.addMaterial(formData);

      if (response.success) {
        toast({
          title: 'Material agregado',
          description: 'El material se ha agregado exitosamente',
          status: 'success',
          duration: 3000,
        });

        handleClose();
        onSuccess();
      }
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar el material',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', path: '', type: 'image' });
    setErrors({});
    setUploadMode('upload');
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const isSubmitDisabled = loading || uploading || (uploadMode === 'upload' && !formData.path);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Material</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel>Nombre (Opcional)</FormLabel>
              <Input
                placeholder="Ej: Banner Promocional"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.type}>
              <FormLabel>Tipo de material</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) => {
                  setFormData({ ...formData, type: e.target.value as 'image' | 'video', path: '' });
                  setSelectedFile(null);
                  setPreviewUrl('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                  if (errors.type) {
                    setErrors({ ...errors, type: '' });
                  }
                }}
              >
                <option value="image">Imagen</option>
                <option value="video">Video</option>
              </Select>
              <FormErrorMessage>{errors.type}</FormErrorMessage>
            </FormControl>

            <Divider />

            <FormControl isRequired>
              <FormLabel>Método de carga</FormLabel>
              <RadioGroup value={uploadMode} onChange={handleModeChange}>
                <HStack spacing={4}>
                  <Radio value="upload">
                    <HStack>
                      <Icon as={MdCloudUpload} />
                      <Text>Subir archivo</Text>
                    </HStack>
                  </Radio>
                  <Radio value="url">
                    <HStack>
                      <Icon as={MdLink} />
                      <Text>Ingresar URL</Text>
                    </HStack>
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {uploadMode === 'upload' ? (
              <FormControl isRequired isInvalid={!!errors.path}>
                <FormLabel>Archivo</FormLabel>
                <VStack spacing={3} align="stretch">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileSelect}
                    display="none"
                  />

                  <Button
                    leftIcon={<MdCloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    isDisabled={uploading || !!formData.path}
                    colorScheme={selectedFile ? 'green' : 'blue'}
                    variant="outline"
                  >
                    {selectedFile ? selectedFile.name : `Seleccionar ${formData.type === 'image' ? 'imagen' : 'video'}`}
                  </Button>

                  {previewUrl && (
                    <Box borderWidth="1px" borderRadius="md" p={2}>
                      <Image src={previewUrl} maxH="200px" objectFit="contain" mx="auto" />
                    </Box>
                  )}

                  {selectedFile && !formData.path && (
                    <Button
                      colorScheme="blue"
                      onClick={handleUploadFile}
                      isLoading={uploading}
                      loadingText="Subiendo..."
                    >
                      Subir archivo
                    </Button>
                  )}

                  {uploading && (
                    <Box>
                      <Progress value={uploadProgress} size="sm" colorScheme="blue" hasStripe isAnimated />
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        Subiendo... {uploadProgress}%
                      </Text>
                    </Box>
                  )}

                  {formData.path && (
                    <Box p={3} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
                      <HStack>
                        <Icon as={MdCheckCircle} color="green.500" />
                        <Text fontSize="sm" color="green.700" fontWeight="medium">
                          Archivo subido exitosamente
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="green.600" mt={1} isTruncated>
                        {formData.path}
                      </Text>
                    </Box>
                  )}
                </VStack>
                <FormErrorMessage>{errors.path}</FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl isRequired isInvalid={!!errors.path}>
                <FormLabel>URL del archivo</FormLabel>
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.path}
                  onChange={(e) => {
                    setFormData({ ...formData, path: e.target.value });
                    if (errors.path) {
                      setErrors({ ...errors, path: '' });
                    }
                  }}
                />
                <FormErrorMessage>{errors.path}</FormErrorMessage>
              </FormControl>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading || uploading}>
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={isSubmitDisabled}
          >
            {uploadMode === 'upload' && selectedFile && !formData.path
              ? 'Subir y Agregar'
              : 'Agregar Material'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
