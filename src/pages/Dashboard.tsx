import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Icon,
  Flex,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  VStack,
  HStack,
  Heading,
  Card,
  CardBody,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  MdDevices,
  MdBattery80,
  MdCheckCircle,
  MdCalendarToday,
  MdWarning,
  MdSignalCellularAlt,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import type { DashboardStats, Cabinet } from '@/types/api.types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCabinets, setRecentCabinets] = useState<Cabinet[]>([]);
  const [offlineCabinets, setOfflineCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [cabinetsRes, allCabinetsRes, batteriesRes, plansRes] = await Promise.all([
        apiService.getCabinets({ page: 1, page_size: 1 }),
        apiService.getCabinets({ page: 1, page_size: 20 }), // Get recent cabinets
        apiService.getBatteries({ page: 1, page_size: 1 }),
        apiService.getPlans({ page: 1 }),
      ]);

      if (cabinetsRes.success && batteriesRes.success && plansRes.success) {
        const onlineCabs = allCabinetsRes.data?.list.filter((c) => c.is_online === 1) || [];
        const offlineCabs = allCabinetsRes.data?.list.filter((c) => c.is_online === 0) || [];

        setStats({
          totalCabinets: cabinetsRes.data?.total || 0,
          onlineCabinets: onlineCabs.length,
          totalBatteries: batteriesRes.data?.total || 0,
          availableBatteries:
            batteriesRes.data?.list.filter((b) => b.status === 'available').length || 0,
          activePlans: plansRes.data?.total || 0,
        });

        // Set recent online cabinets with heartbeat
        setRecentCabinets(
          onlineCabs
            .filter((c) => c.lastPingAt)
            .sort(
              (a, b) =>
                new Date(b.lastPingAt!).getTime() - new Date(a.lastPingAt!).getTime()
            )
            .slice(0, 5)
        );

        // Set offline cabinets
        setOfflineCabinets(offlineCabs.slice(0, 5));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos del panel');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const statCards = [
    {
      label: 'Total de Gabinetes',
      value: stats?.totalCabinets || 0,
      helpText: `${stats?.onlineCabinets || 0} en línea`,
      icon: MdDevices,
      color: 'blue',
    },
    {
      label: 'Total de Baterías',
      value: stats?.totalBatteries || 0,
      helpText: `${stats?.availableBatteries || 0} disponibles`,
      icon: MdBattery80,
      color: 'green',
    },
    {
      label: 'Planes Activos',
      value: stats?.activePlans || 0,
      helpText: 'Campañas publicitarias',
      icon: MdCalendarToday,
      color: 'purple',
    },
    {
      label: 'Estado del Sistema',
      value: 'Saludable',
      helpText: 'Todos los sistemas operativos',
      icon: MdCheckCircle,
      color: 'teal',
    },
  ];

  return (
    <Box>
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={8}>
        {statCards.map((card, index) => (
          <GridItem key={index}>
            <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
              <Flex align="center" mb={4}>
                <Icon as={card.icon} boxSize={8} color={`${card.color}.500`} mr={3} />
                <Box>
                  <Stat>
                    <StatLabel fontSize="sm" color="gray.500">
                      {card.label}
                    </StatLabel>
                    <StatNumber fontSize="2xl">{card.value}</StatNumber>
                    <StatHelpText mb={0}>
                      {card.color === 'teal' ? (
                        <Text fontSize="xs">{card.helpText}</Text>
                      ) : (
                        <>
                          <StatArrow type="increase" />
                          {card.helpText}
                        </>
                      )}
                    </StatHelpText>
                  </Stat>
                </Box>
              </Flex>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Monitoring sections */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={6}>
        {/* Recent Heartbeats */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Heading size="md">Heartbeats Recientes</Heading>
                <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
              </HStack>
              {recentCabinets.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={4}>
                  No hay gabinetes con heartbeat reciente
                </Text>
              ) : (
                <VStack align="stretch" spacing={3}>
                  {recentCabinets.map((cabinet) => (
                    <Box
                      key={cabinet.id}
                      p={3}
                      borderWidth={1}
                      borderRadius="md"
                      _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                      onClick={() => navigate(`/cabinets/${cabinet.cabinet_id}`)}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{cabinet.cabinet_id}</Text>
                          <HStack spacing={2}>
                            <Badge colorScheme="green" size="sm">
                              ONLINE
                            </Badge>
                            {cabinet.signalStrength && (
                              <HStack spacing={1}>
                                <Icon
                                  as={MdSignalCellularAlt}
                                  boxSize={3}
                                  color={
                                    cabinet.signalStrength >= 20
                                      ? 'green.500'
                                      : cabinet.signalStrength >= 10
                                        ? 'yellow.500'
                                        : 'red.500'
                                  }
                                />
                                <Text fontSize="xs" color="gray.600">
                                  {cabinet.signalStrength}/31
                                </Text>
                              </HStack>
                            )}
                          </HStack>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <Text fontSize="xs" color="gray.500">
                            {cabinet.lastPingAt &&
                              new Date(cabinet.lastPingAt).toLocaleTimeString()}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {cabinet.connectionType?.toUpperCase() || 'N/A'}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Offline Cabinets */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Heading size="md">Gabinetes Offline</Heading>
                <Icon as={MdWarning} boxSize={6} color="red.500" />
              </HStack>
              {offlineCabinets.length === 0 ? (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">Todos los gabinetes están en línea</Text>
                </Alert>
              ) : (
                <VStack align="stretch" spacing={3}>
                  {offlineCabinets.map((cabinet) => (
                    <Box
                      key={cabinet.id}
                      p={3}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor="red.200"
                      bg="red.50"
                      _hover={{ bg: 'red.100', cursor: 'pointer' }}
                      onClick={() => navigate(`/cabinets/${cabinet.cabinet_id}`)}
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{cabinet.cabinet_id}</Text>
                          <Badge colorScheme="red" size="sm">
                            OFFLINE
                          </Badge>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <Text fontSize="xs" color="gray.600">
                            {cabinet.lastPingAt
                              ? `Último: ${new Date(cabinet.lastPingAt).toLocaleString()}`
                              : 'Sin heartbeat'}
                          </Text>
                          {cabinet.address && (
                            <Text fontSize="xs" color="gray.500">
                              {cabinet.address}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* System health */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Estado del Sistema
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box p={4} borderWidth={1} borderRadius="md" bg="green.50" borderColor="green.200">
              <HStack>
                <Icon as={MdCheckCircle} color="green.500" boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="green.700">
                    API
                  </Text>
                  <Text fontSize="sm" color="green.600">
                    Operacional
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <Box p={4} borderWidth={1} borderRadius="md" bg="green.50" borderColor="green.200">
              <HStack>
                <Icon as={MdDevices} color="green.500" boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="green.700">
                    Gabinetes
                  </Text>
                  <Text fontSize="sm" color="green.600">
                    {stats?.onlineCabinets}/{stats?.totalCabinets} en línea
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <Box p={4} borderWidth={1} borderRadius="md" bg="blue.50" borderColor="blue.200">
              <HStack>
                <Icon as={MdBattery80} color="blue.500" boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="blue.700">
                    Baterías
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    {stats?.availableBatteries} disponibles
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
}
