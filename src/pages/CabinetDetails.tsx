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
  ButtonGroup,
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
  Wrap,
  WrapItem,
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
          {/* Botones en mobile (wrap) */}
          <Wrap spacing={3} display={{ base: 'flex', md: 'none' }}>
            <WrapItem>
              <Button
                leftIcon={<AddIcon />}
                onClick={rentalModal.onOpen}
                colorScheme="green"
                variant="solid"
                size="sm"
                boxShadow="sm"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
                isDisabled={availableBatterySlots.length === 0}
              >
                Crear Alquiler
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<RepeatIcon />}
                onClick={fetchData}
                isLoading={refreshing}
                variant="solid"
                colorScheme="brand"
                size="sm"
                boxShadow="sm"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
              >
                Actualizar
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<UnlockIcon />}
                onClick={handleOpenAllSlots}
                colorScheme="orange"
                variant="solid"
                size="sm"
                boxShadow="sm"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
              >
                Abrir Todas
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                leftIcon={<SettingsIcon />}
                onClick={handleRestartCabinet}
                colorScheme="red"
                variant="solid"
                size="sm"
                boxShadow="sm"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
              >
                Reiniciar
              </Button>
            </WrapItem>
          </Wrap>

          {/* Botones en desktop/tablet (grupo adjunto) */}
          <ButtonGroup
            isAttached
            variant="solid"
            size="md"
            spacing={0}
            display={{ base: 'none', md: 'inline-flex' }}
          >
            <Button
              leftIcon={<AddIcon />}
              onClick={rentalModal.onOpen}
              colorScheme="green"
              _hover={{ boxShadow: 'md' }}
              isDisabled={availableBatterySlots.length === 0}
            >
              Crear Alquiler
            </Button>
            <Button
              leftIcon={<RepeatIcon />}
              onClick={fetchData}
              isLoading={refreshing}
              colorScheme="brand"
              _hover={{ boxShadow: 'md' }}
            >
              Actualizar
            </Button>
            <Button
              leftIcon={<UnlockIcon />}
              onClick={handleOpenAllSlots}
              colorScheme="orange"
              _hover={{ boxShadow: 'md' }}
            >
              Abrir Todas
            </Button>
            <Button
              leftIcon={<SettingsIcon />}
              onClick={handleRestartCabinet}
              colorScheme="red"
              _hover={{ boxShadow: 'md' }}
            >
              Reiniciar
            </Button>
          </ButtonGroup>
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
    </Container>
  );
}
