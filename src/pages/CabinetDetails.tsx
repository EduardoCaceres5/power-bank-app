import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Stack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Divider,
  Icon,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  useDisclosure,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  InfoIcon,
  TimeIcon,
  RepeatIcon,
  UnlockIcon,
  CheckCircleIcon,
  SettingsIcon,
  AddIcon,
  ChevronDownIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { FaWifi, FaBatteryFull, FaNetworkWired, FaMobile, FaBatteryEmpty } from 'react-icons/fa';
import { apiService } from '@/services/api';
import type { Cabinet, CabinetDetails, DeviceInfo } from '@/types/api.types';
import { normalizeCabinet } from '@/utils/cabinet';
import DeviceRegistrationModal from '@/components/cabinets/DeviceRegistrationModal';
import CreateRentalModal from '@/components/rentals/CreateRentalModal';
import { DetailsSkeleton } from '@/components/common/SkeletonLoader';

export default function CabinetDetailsPage() {
  const { cabinetId } = useParams<{ cabinetId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  // Feature flag para registro de dispositivos
  const enableDeviceRegistration = import.meta.env.VITE_ENABLE_DEVICE_REGISTRATION === 'true';

  // Theme colors
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const emptySlotBg = useColorModeValue('white', 'gray.700');
  const slotBorderColor = useColorModeValue('gray.200', 'gray.600');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const greenSlotBg = useColorModeValue('green.50', 'green.900');
  const yellowSlotBg = useColorModeValue('yellow.50', 'yellow.900');
  const orangeSlotBg = useColorModeValue('orange.50', 'orange.900');

  const [cabinet, setCabinet] = useState<Cabinet | null>(null);
  const [cabinetDetails, setCabinetDetails] = useState<CabinetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const deviceRegModal = useDisclosure();
  const rentalModal = useDisclosure();
  const openAllDialog = useDisclosure();
  const restartDialog = useDisclosure();
  const cancelRef = useState<HTMLButtonElement>(null)[0];

  const fetchData = async () => {
    if (!cabinetId) return;

    try {
      setRefreshing(true);
      const [infoResponse, detailsResponse] = await Promise.all([
        apiService.getCabinetInfo(cabinetId),
        apiService.getCabinetDetails(cabinetId),
      ]);

      if (infoResponse.success && infoResponse.data) {
        setCabinet(normalizeCabinet(infoResponse.data));
      }

      if (detailsResponse.success && detailsResponse.data) {
        setCabinetDetails(detailsResponse.data);
      }
    } catch (error) {
      toast({
        title: 'Error al cargar detalles',
        description: error instanceof Error ? error.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cabinetId]);

  const handleOpenSlot = async (lockId: number) => {
    if (!cabinetId) return;

    try {
      const response = await apiService.openSlot(cabinetId, lockId);
      if (response.success) {
        toast({
          title: `Ranura ${lockId} abierta`,
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error al abrir ranura',
        description: error instanceof Error ? error.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleOpenAllSlots = async () => {
    if (!cabinetId) return;

    try {
      openAllDialog.onClose();
      const response = await apiService.openAllSlots(cabinetId);
      if (response.success) {
        toast({
          title: 'Todas las ranuras abiertas',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error al abrir ranuras',
        description: error instanceof Error ? error.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleRestartCabinet = async () => {
    if (!cabinetId) return;

    try {
      restartDialog.onClose();
      const response = await apiService.restartCabinet(cabinetId);
      if (response.success) {
        toast({
          title: 'Gabinete reiniciado',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error al reiniciar',
        description: error instanceof Error ? error.message : 'Error desconocido',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getConnectionIcon = (type?: string) => {
    switch (type) {
      case 'wifi':
        return FaWifi;
      case 'ethernet':
        return FaNetworkWired;
      case '4g':
        return FaMobile;
      default:
        return InfoIcon;
    }
  };

  const formatLastPing = (timestampInSeconds?: number) => {
    if (typeof timestampInSeconds !== 'number' || !timestampInSeconds) {
      return '-';
    }
    const date = new Date(timestampInSeconds * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    if (diffMs < 0) {
      return 'Futuro';
    }

    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    return date.toLocaleString('es-PY');
  };

  const formatTimestampToAsuncion = (timestampInSeconds?: number) => {
    if (typeof timestampInSeconds !== 'number' || !timestampInSeconds) {
      return '-';
    }
    const date = new Date(timestampInSeconds * 1000);

    return date.toLocaleString('es-PY');
  };

  const getSlotColor = (slot: DeviceInfo) => {
    if (slot.bid) {
      if (slot.power && slot.power >= 80) return 'green';
      if (slot.power && slot.power >= 50) return 'yellow';
      return 'orange';
    }
    return 'gray';
  };

  const getSlotBg = (slot: DeviceInfo | undefined, isOccupied: boolean) => {
    if (!isOccupied || !slot) return emptySlotBg;
    const color = getSlotColor(slot);
    if (color === 'green') return greenSlotBg;
    if (color === 'yellow') return yellowSlotBg;
    if (color === 'orange') return orangeSlotBg;
    return emptySlotBg;
  };

  const getSlotsCount = (model?: string) => {
    switch (model) {
      case 'pm8':
        return 8;
      case 'pm12':
        return 12;
      case 'pm20':
        return 20;
      default:
        return 8;
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <DetailsSkeleton />
      </Container>
    );
  }

  if (!cabinet) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Gabinete no encontrado</AlertTitle>
          <AlertDescription>No se pudo cargar la información del gabinete.</AlertDescription>
        </Alert>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate('/cabinets')} mt={4}>
          Volver a Gabinetes
        </Button>
      </Container>
    );
  }

  const totalSlots = getSlotsCount(cabinet.model);
  const slots = cabinetDetails?.device || [];
  const occupiedSlots = slots.filter((s) => s.bid !== '').length;
  const availableSlots = totalSlots - occupiedSlots;

  // Get slots with available batteries (occupied and not empty)
  const availableBatterySlots = slots
    .filter((s) => s.bid !== '')
    .map((s) => s.lock);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          spacing={4}
        >
          <HStack spacing={4} flexWrap="wrap" align="center">
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate('/cabinets')}
              variant="ghost"
              size={{ base: 'sm', md: 'md' }}
            >
              Volver
            </Button>
            <Heading size={{ base: 'md', md: 'lg' }}>{cabinet.cabinet_id}</Heading>
            <Badge
              colorScheme={cabinet.is_online ? 'green' : 'red'}
              fontSize={{ base: 'sm', md: 'md' }}
              px={{ base: 2, md: 3 }}
              py={{ base: 0.5, md: 1 }}
            >
              {cabinet.is_online ? 'EN LÍNEA' : 'FUERA DE LÍNEA'}
            </Badge>
          </HStack>

          {/* Botones reorganizados - Mobile */}
          <VStack spacing={3} display={{ base: 'flex', md: 'none' }} align="stretch">
            <HStack spacing={3}>
              <Tooltip label="Crear un nuevo alquiler para un cliente">
                <Button
                  leftIcon={<AddIcon />}
                  onClick={rentalModal.onOpen}
                  colorScheme="green"
                  variant="solid"
                  size="md"
                  flex="1"
                  boxShadow="md"
                  _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  isDisabled={availableBatterySlots.length === 0}
                  fontWeight="bold"
                >
                  Crear Alquiler
                </Button>
              </Tooltip>
              <Tooltip label="Actualizar información del gabinete">
                <IconButton
                  icon={<RepeatIcon />}
                  onClick={fetchData}
                  isLoading={refreshing}
                  variant="outline"
                  colorScheme="brand"
                  size="md"
                  aria-label="Actualizar"
                  boxShadow="sm"
                  _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
                  transition="all 0.2s"
                />
              </Tooltip>
            </HStack>
            <Menu>
              <Tooltip label="Acciones de mantenimiento avanzadas">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<SettingsIcon />}
                  variant="outline"
                  colorScheme="gray"
                  size="md"
                  w="full"
                  boxShadow="sm"
                >
                  Acciones de Mantenimiento
                </MenuButton>
              </Tooltip>
              <MenuList>
                <MenuItem
                  icon={<UnlockIcon />}
                  onClick={openAllDialog.onOpen}
                  color="orange.600"
                  _hover={{ bg: 'orange.50' }}
                >
                  Abrir Todas las Ranuras
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<WarningIcon />}
                  onClick={restartDialog.onOpen}
                  color="red.600"
                  _hover={{ bg: 'red.50' }}
                >
                  Reiniciar Gabinete
                </MenuItem>
              </MenuList>
            </Menu>
          </VStack>

          {/* Botones reorganizados - Desktop/Tablet */}
          <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
            <Tooltip label="Crear un nuevo alquiler para un cliente" hasArrow placement="bottom">
              <Button
                leftIcon={<AddIcon />}
                onClick={rentalModal.onOpen}
                colorScheme="green"
                variant="solid"
                size="md"
                boxShadow="md"
                _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                isDisabled={availableBatterySlots.length === 0}
                fontWeight="bold"
                px={6}
              >
                Crear Alquiler
              </Button>
            </Tooltip>

            <Box w="1px" h="40px" bg="gray.300" />

            <Tooltip label="Actualizar información del gabinete" hasArrow placement="bottom">
              <Button
                leftIcon={<RepeatIcon />}
                onClick={fetchData}
                isLoading={refreshing}
                variant="outline"
                colorScheme="brand"
                size="md"
                boxShadow="sm"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                Actualizar
              </Button>
            </Tooltip>

            <Box w="1px" h="40px" bg="gray.300" />

            <Menu>
              <Tooltip label="Acciones de mantenimiento avanzadas" hasArrow placement="bottom">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<SettingsIcon />}
                  variant="outline"
                  colorScheme="gray"
                  size="md"
                  boxShadow="sm"
                  _hover={{ boxShadow: 'md' }}
                >
                  Mantenimiento
                </MenuButton>
              </Tooltip>
              <MenuList>
                <MenuItem
                  icon={<UnlockIcon />}
                  onClick={openAllDialog.onOpen}
                  color="orange.600"
                  _hover={{ bg: 'orange.50' }}
                >
                  Abrir Todas las Ranuras
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<WarningIcon />}
                  onClick={restartDialog.onOpen}
                  color="red.600"
                  _hover={{ bg: 'red.50' }}
                >
                  Reiniciar Gabinete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Stack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Modelo</StatLabel>
                <StatNumber>{cabinet.model?.toUpperCase()}</StatNumber>
                <StatHelpText>{totalSlots} ranuras totales</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Ranuras Ocupadas</StatLabel>
                <StatNumber>{occupiedSlots}</StatNumber>
                <StatHelpText>de {totalSlots}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Ranuras Disponibles</StatLabel>
                <StatNumber>{availableSlots}</StatNumber>
                <StatHelpText>
                  {Math.round((availableSlots / totalSlots) * 100)}% libre
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack>
                    <TimeIcon />
                    <Text>Último Heartbeat</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="lg">{formatLastPing(cabinet.heart_time)}</StatNumber>
                <StatHelpText>
                  {cabinet.heart_time ? formatTimestampToAsuncion(cabinet.heart_time) : 'Sin datos'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Device Info */}
        {enableDeviceRegistration && (
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Información del Dispositivo</Heading>
                <Divider />
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <HStack>
                    <Icon as={getConnectionIcon(cabinet.connectionType)} color="brand.500" />
                    <Box>
                      <Text fontSize="sm" color={textSecondary}>
                        Tipo de Conexión
                      </Text>
                      <Text fontWeight="medium">
                        {cabinet.connectionType?.toUpperCase() || 'Desconocido'}
                      </Text>
                    </Box>
                  </HStack>
                  <Box>
                    <Text fontSize="sm" color={textSecondary}>
                      Dirección IP
                    </Text>
                    <Text fontWeight="medium">{cabinet.ipAddress || 'No disponible'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={textSecondary}>
                      Device ID
                    </Text>
                    <HStack>
                      <Text fontWeight="medium">{cabinet.deviceId || 'No registrado'}</Text>
                      {!cabinet.deviceId && (
                        <Button
                          size="xs"
                          colorScheme="brand"
                          onClick={deviceRegModal.onOpen}
                          leftIcon={<InfoIcon />}
                        >
                          Registrar
                        </Button>
                      )}
                    </HStack>
                  </Box>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Slots Grid */}
        <Card>
          <CardBody p={{ base: 3, md: 6 }}>
            <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
              <Heading size={{ base: 'sm', md: 'md' }}>
                Vista de Ranuras ({cabinet.model?.toUpperCase()})
              </Heading>
              <Divider />
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
                gap={{ base: 3, sm: 3, md: 4 }}
              >
                {Array.from({ length: totalSlots }, (_, index) => {
                  const slotNumber = index + 1;
                  const slot = slots.find((s: { lock: number }) => s.lock === slotNumber);
                  const isOccupied = slot?.bid !== '';
                  const batteryLevel = slot?.power || 0;
                  const slotColorScheme = slot ? getSlotColor(slot) : 'gray';

                  return (
                    <GridItem key={slotNumber}>
                      <Card
                        variant="outline"
                        borderWidth={2}
                        borderColor={slot ? `${slotColorScheme}.400` : slotBorderColor}
                        borderStyle={isOccupied ? 'solid' : 'dashed'}
                        bg={getSlotBg(slot, isOccupied)}
                        _hover={{ shadow: 'md', transform: 'scale(1.02)' }}
                        transition="all 0.2s"
                        h="full"
                        opacity={isOccupied ? 1 : 0.7}
                      >
                        <CardBody p={{ base: 2, sm: 3, md: 4 }}>
                          <VStack spacing={{ base: 1, md: 2 }} h="full" justify="space-between">
                            <HStack justify="space-between" w="full">
                              <Text
                                fontWeight="bold"
                                fontSize={{ base: 'sm', md: 'md' }}
                                noOfLines={1}
                              >
                                #{slotNumber}
                              </Text>
                              {isOccupied ? (
                                <Icon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                  boxSize={{ base: 3, md: 4 }}
                                />
                              ) : (
                                <Icon
                                  as={FaBatteryEmpty}
                                  color="gray.400"
                                  boxSize={{ base: 3, md: 4 }}
                                />
                              )}
                            </HStack>

                            {isOccupied && slot ? (
                              <VStack spacing={{ base: 0, md: 1 }} w="full" align="center">
                                <HStack justify="center" spacing={1}>
                                  <Icon
                                    as={FaBatteryFull}
                                    color={`${getSlotColor(slot)}.500`}
                                    boxSize={{ base: 4, md: 5 }}
                                  />
                                  <Text
                                    fontWeight="bold"
                                    fontSize={{ base: 'lg', md: '2xl' }}
                                    lineHeight="1"
                                  >
                                    {batteryLevel}%
                                  </Text>
                                </HStack>
                                {slot.bid && (
                                  <Text
                                    fontSize={{ base: '2xs', md: 'xs' }}
                                    color={textSecondary}
                                    noOfLines={1}
                                    w="full"
                                    textAlign="center"
                                  >
                                    {slot.bid}
                                  </Text>
                                )}
                              </VStack>
                            ) : (
                              <VStack spacing={{ base: 1, md: 2 }} py={{ base: 2, md: 4 }}>
                                <Icon
                                  as={FaBatteryEmpty}
                                  color={emptyTextColor}
                                  boxSize={{ base: 6, md: 8 }}
                                />
                                <Text
                                  color={emptyTextColor}
                                  fontSize={{ base: 'xs', md: 'sm' }}
                                  textAlign="center"
                                  fontWeight="medium"
                                >
                                  No conectada
                                </Text>
                              </VStack>
                            )}

                            {isOccupied && (
                              <Tooltip label="Abrir ranura">
                                <Button
                                  size={{ base: 'xs', md: 'sm' }}
                                  colorScheme="brand"
                                  onClick={() => handleOpenSlot(slotNumber)}
                                  w="full"
                                  fontSize={{ base: 'xs', md: 'sm' }}
                                  leftIcon={<UnlockIcon />}
                                >
                                  Abrir
                                </Button>
                              </Tooltip>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  );
                })}
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        {/* Additional Info */}
        {cabinet.address && (
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={2}>
                <Heading size="sm">Ubicación</Heading>
                <Text>{cabinet.address}</Text>
                {cabinet.latitude && cabinet.longitude && (
                  <Text fontSize="sm" color={textSecondary}>
                    Coordenadas: {cabinet.latitude}, {cabinet.longitude}
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Device Registration Modal */}
      {enableDeviceRegistration && cabinetId && (
        <DeviceRegistrationModal
          isOpen={deviceRegModal.isOpen}
          onClose={deviceRegModal.onClose}
          onSuccess={fetchData}
          cabinetId={cabinetId}
        />
      )}

      {/* Create Rental Modal */}
      {cabinetId && (
        <CreateRentalModal
          isOpen={rentalModal.isOpen}
          onClose={rentalModal.onClose}
          onSuccess={fetchData}
          cabinetId={cabinetId}
          slots={slots}
          availableSlots={availableBatterySlots}
        />
      )}

      {/* Confirmation Dialog - Open All Slots */}
      <AlertDialog
        isOpen={openAllDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={openAllDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack spacing={2}>
                <Icon as={UnlockIcon} color="orange.500" />
                <Text>Abrir Todas las Ranuras</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack align="stretch" spacing={3}>
                <Text>
                  ¿Estás seguro de que deseas abrir <strong>todas las ranuras</strong> del gabinete{' '}
                  <strong>{cabinet.cabinet_id}</strong>?
                </Text>
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">Acción de Mantenimiento</AlertTitle>
                    <AlertDescription fontSize="sm">
                      Esta acción abrirá todas las ranuras simultáneamente. Úsala solo para tareas
                      de mantenimiento.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={openAllDialog.onClose}>
                Cancelar
              </Button>
              <Button colorScheme="orange" onClick={handleOpenAllSlots} ml={3}>
                Confirmar y Abrir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Confirmation Dialog - Restart Cabinet */}
      <AlertDialog
        isOpen={restartDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={restartDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack spacing={2}>
                <Icon as={WarningIcon} color="red.500" />
                <Text>Reiniciar Gabinete</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack align="stretch" spacing={3}>
                <Text>
                  ¿Estás seguro de que deseas reiniciar el gabinete{' '}
                  <strong>{cabinet.cabinet_id}</strong>?
                </Text>
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">Acción Crítica</AlertTitle>
                    <AlertDescription fontSize="sm">
                      El gabinete se desconectará temporalmente y todos los procesos en curso
                      podrían verse afectados. Esta acción debe usarse solo en casos de
                      emergencia o mantenimiento crítico.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={restartDialog.onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleRestartCabinet} ml={3}>
                Confirmar y Reiniciar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
