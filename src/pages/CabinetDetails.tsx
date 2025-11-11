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
  WarningIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { FaWifi, FaBatteryFull, FaNetworkWired, FaMobile } from 'react-icons/fa';
import { apiService } from '@/services/api';
import type { Cabinet, CabinetDetails, SlotInfo } from '@/types/api.types';
import DeviceRegistrationModal from '@/components/cabinets/DeviceRegistrationModal';
import { DetailsSkeleton } from '@/components/common/SkeletonLoader';

export default function CabinetDetailsPage() {
  const { cabinetId } = useParams<{ cabinetId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

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

  const fetchData = async () => {
    if (!cabinetId) return;

    try {
      setRefreshing(true);
      const [infoResponse, detailsResponse] = await Promise.all([
        apiService.getCabinetInfo(cabinetId),
        apiService.getCabinetDetails(cabinetId),
      ]);

      if (infoResponse.success && infoResponse.data) {
        setCabinet(infoResponse.data);
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

  const formatLastPing = (lastPingAt?: string) => {
    if (!lastPingAt) return 'Nunca';
    const date = new Date(lastPingAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  const getSlotColor = (slot: SlotInfo) => {
    if (slot.status === 1) {
      // Occupied
      if (slot.battery_power && slot.battery_power >= 80) return 'green';
      if (slot.battery_power && slot.battery_power >= 50) return 'yellow';
      return 'orange';
    }
    return 'gray';
  };

  const getSlotBg = (slot: SlotInfo | undefined, isOccupied: boolean) => {
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
  const slots = cabinetDetails?.slots || [];
  const occupiedSlots = slots.filter((s) => s.status === 1).length;
  const availableSlots = totalSlots - occupiedSlots;

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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
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
                <StatNumber fontSize="lg">{formatLastPing(cabinet.lastPingAt)}</StatNumber>
                <StatHelpText>
                  {cabinet.lastPingAt ? new Date(cabinet.lastPingAt).toLocaleString() : 'Sin datos'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Señal</StatLabel>
                <StatNumber>
                  {cabinet.signalStrength ? `${cabinet.signalStrength}/31` : 'N/A'}
                </StatNumber>
                <StatHelpText>
                  {cabinet.signalStrength && cabinet.signalStrength >= 20
                    ? 'Excelente'
                    : cabinet.signalStrength && cabinet.signalStrength >= 10
                      ? 'Buena'
                      : 'Baja'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Device Info */}
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

        {/* Slots Grid */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Vista de Ranuras ({cabinet.model?.toUpperCase()})</Heading>
              <Divider />
              <Grid
                templateColumns={{
                  base: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(5, 1fr)',
                }}
                gap={4}
              >
                {Array.from({ length: totalSlots }, (_, index) => {
                  const slotNumber = index + 1;
                  const slot = slots.find((s) => s.lock_id === slotNumber);
                  const isOccupied = slot?.status === 1;
                  const batteryLevel = slot?.battery_power || 0;
                  const slotColorScheme = slot ? getSlotColor(slot) : 'gray';

                  return (
                    <GridItem key={slotNumber}>
                      <Card
                        variant="outline"
                        borderWidth={2}
                        borderColor={slot ? `${slotColorScheme}.400` : slotBorderColor}
                        bg={getSlotBg(slot, isOccupied)}
                        _hover={{ shadow: 'md', transform: 'scale(1.02)' }}
                        transition="all 0.2s"
                      >
                        <CardBody>
                          <VStack spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold" fontSize="lg">
                                #{slotNumber}
                              </Text>
                              {isOccupied ? (
                                <Icon as={CheckCircleIcon} color="green.500" />
                              ) : (
                                <Icon as={WarningIcon} color="gray.400" />
                              )}
                            </HStack>

                            {isOccupied && slot ? (
                              <VStack spacing={1} w="full" align="stretch">
                                <HStack justify="center">
                                  <Icon as={FaBatteryFull} color={`${getSlotColor(slot)}.500`} />
                                  <Text fontWeight="bold" fontSize="2xl">
                                    {batteryLevel}%
                                  </Text>
                                </HStack>
                                {slot.battery_id && (
                                  <Text fontSize="xs" color={textSecondary} textAlign="center">
                                    {slot.battery_id}
                                  </Text>
                                )}
                              </VStack>
                            ) : (
                              <Text color={emptyTextColor} fontSize="sm">
                                Vacío
                              </Text>
                            )}

                            <Tooltip label="Abrir ranura">
                              <Button
                                size="sm"
                                colorScheme={isOccupied ? 'brand' : 'gray'}
                                onClick={() => handleOpenSlot(slotNumber)}
                                w="full"
                              >
                                Abrir
                              </Button>
                            </Tooltip>
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
      {cabinetId && (
        <DeviceRegistrationModal
          isOpen={deviceRegModal.isOpen}
          onClose={deviceRegModal.onClose}
          onSuccess={fetchData}
          cabinetId={cabinetId}
        />
      )}
    </Container>
  );
}
