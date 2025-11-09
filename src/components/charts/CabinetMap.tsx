import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Card } from '../common/Card';
import { Cabinet } from '@/types/api.types';
import apiService from '@/services/api';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom marker icons based on cabinet status
const createCustomIcon = (status: number, availableBatteries?: number) => {
  const isOnline = status === 1;
  const hasAvailableBatteries = (availableBatteries ?? 0) > 0;

  let color = '#9CA3AF'; // gray for offline
  if (isOnline && hasAvailableBatteries) {
    color = '#10B981'; // green for online with batteries
  } else if (isOnline && !hasAvailableBatteries) {
    color = '#F59E0B'; // amber for online but no batteries
  }

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to handle map centering and bounds
function MapController({ cabinets }: { cabinets: Cabinet[] }) {
  const map = useMap();

  useEffect(() => {
    if (cabinets.length > 0) {
      const bounds = L.latLngBounds(
        cabinets
          .filter(c => c.latitude && c.longitude)
          .map(c => [c.latitude!, c.longitude!])
      );

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [cabinets, map]);

  return null;
}

export function CabinetMap() {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Color mode values
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadCabinets();
  }, []);

  const loadCabinets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCabinets();

      if (response.success && response.data) {
        // Filter cabinets that have valid coordinates
        const validCabinets = response.data.list.filter(
          c => c.latitude !== null && c.longitude !== null &&
               c.latitude !== undefined && c.longitude !== undefined
        );
        setCabinets(validCabinets);
      }
    } catch (err) {
      console.error('Error loading cabinets:', err);
      setError('Error al cargar los gabinetes');
    } finally {
      setLoading(false);
    }
  };

  // Get available batteries count from cabinet details
  const getAvailableBatteries = (_cabinet: Cabinet): number => {
    // This would need to be enhanced based on your actual data structure
    // For now, we'll use a placeholder
    return 0;
  };

  if (loading) {
    return (
      <Card p={6}>
        <Heading size="md" mb={4} color={textColor}>
          Mapa de Gabinetes
        </Heading>
        <Flex align="center" justify="center" h="384px">
          <Text color={textSecondary}>Cargando mapa...</Text>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card p={6}>
        <Heading size="md" mb={4} color={textColor}>
          Mapa de Gabinetes
        </Heading>
        <Flex align="center" justify="center" h="384px">
          <Text color="red.500">{error}</Text>
        </Flex>
      </Card>
    );
  }

  if (cabinets.length === 0) {
    return (
      <Card p={6}>
        <Heading size="md" mb={4} color={textColor}>
          Mapa de Gabinetes
        </Heading>
        <Flex align="center" justify="center" h="384px">
          <Text color={textSecondary}>
            No hay gabinetes con ubicación disponible
          </Text>
        </Flex>
      </Card>
    );
  }

  // Default center (will be overridden by MapController)
  const defaultCenter: [number, number] = [
    cabinets[0].latitude!,
    cabinets[0].longitude!
  ];

  return (
    <Card p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" color={textColor}>Mapa de Gabinetes</Heading>
        <HStack spacing={4} fontSize="sm">
          <HStack spacing={2}>
            <Box w="12px" h="12px" borderRadius="full" bg="green.500" />
            <Text color={textSecondary}>Disponible</Text>
          </HStack>
          <HStack spacing={2}>
            <Box w="12px" h="12px" borderRadius="full" bg="orange.500" />
            <Text color={textSecondary}>Sin baterías</Text>
          </HStack>
          <HStack spacing={2}>
            <Box w="12px" h="12px" borderRadius="full" bg="gray.400" />
            <Text color={textSecondary}>Fuera de línea</Text>
          </HStack>
        </HStack>
      </Flex>

      <Box
        h="384px"
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController cabinets={cabinets} />

          {cabinets.map((cabinet) => (
            <Marker
              key={cabinet.id}
              position={[cabinet.latitude!, cabinet.longitude!]}
              icon={createCustomIcon(cabinet.is_online, getAvailableBatteries(cabinet))}
            >
              <Popup>
                <VStack align="stretch" p={2} minW="200px" spacing={2}>
                  <Heading size="sm" color="gray.900">
                    {cabinet.cabinet_id}
                  </Heading>

                  <VStack align="stretch" spacing={1} fontSize="sm">
                    <Flex justify="space-between">
                      <Text color="gray.600">Estado:</Text>
                      <Badge colorScheme={cabinet.is_online === 1 ? 'green' : 'gray'}>
                        {cabinet.is_online === 1 ? 'En línea' : 'Fuera de línea'}
                      </Badge>
                    </Flex>

                    <Flex justify="space-between">
                      <Text color="gray.600">Modelo:</Text>
                      <Text fontWeight="medium" color="gray.900">
                        {cabinet.model.toUpperCase()}
                      </Text>
                    </Flex>

                    {cabinet.address && (
                      <Box mt={2} pt={2} borderTopWidth="1px" borderColor="gray.200">
                        <Text color="gray.600" fontSize="xs">
                          {cabinet.address}
                        </Text>
                      </Box>
                    )}

                    {cabinet.lastPingAt && (
                      <Box mt={2} pt={2} borderTopWidth="1px" borderColor="gray.200">
                        <Text color="gray.600" fontSize="xs">
                          Última conexión: {new Date(cabinet.lastPingAt).toLocaleString('es-ES')}
                        </Text>
                      </Box>
                    )}
                  </VStack>

                  <Button
                    size="sm"
                    colorScheme="blue"
                    mt={2}
                    onClick={() => window.location.href = `/cabinets/${cabinet.cabinet_id}`}
                  >
                    Ver detalles
                  </Button>
                </VStack>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>

      <Text mt={4} fontSize="sm" color={textSecondary}>
        Mostrando {cabinets.length} gabinete{cabinets.length !== 1 ? 's' : ''}
      </Text>
    </Card>
  );
}
