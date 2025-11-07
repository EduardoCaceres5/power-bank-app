import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { apiService } from '@/services/api';
import type { Cabinet } from '@/types/api.types';

interface DeleteCabinetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cabinet: Cabinet;
  onSuccess: () => void;
}

export default function DeleteCabinetDialog({
  isOpen,
  onClose,
  cabinet,
  onSuccess,
}: DeleteCabinetDialogProps) {
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await apiService.deleteCabinet(cabinet.cabinet_id);
      if (response.success) {
        toast({
          title: 'Gabinete eliminado exitosamente',
          status: 'success',
          duration: 3000,
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: 'Error al eliminar gabinete',
        description: err instanceof Error ? err.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Eliminar Gabinete
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              ¿Está seguro de que desea eliminar el gabinete <strong>{cabinet.cabinet_id}</strong>?
            </Text>
            <Text mt={2} color="red.500">
              Esta acción no se puede deshacer.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={loading}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
