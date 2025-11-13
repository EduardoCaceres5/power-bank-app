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
  Card as ChakraCard,
  CardBody,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react';
import { Card } from '@/components/common/Card';
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
import {
  DashboardStatsSkeleton,
  CabinetCardSkeleton,
  ChartSkeleton,
  MapSkeleton,
  RevenueChartSkeleton,
} from '@/components/common/SkeletonLoader';
import { CabinetStatusChart } from '@/components/charts/CabinetStatusChart';
import { BatteryLevelChart } from '@/components/charts/BatteryLevelChart';
import { CabinetModelChart } from '@/components/charts/CabinetModelChart';
import { CabinetMap } from '@/components/charts/CabinetMap';
import { RevenueChart } from '@/components/charts/RevenueChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCabinets, setRecentCabinets] = useState<Cabinet[]>([]);
  const [offlineCabinets, setOfflineCabinets] = useState<Cabinet[]>([]);
  const [allCabinets, setAllCabinets] = useState<Cabinet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const offlineBg = useColorModeValue('red.50', 'red.900');
  const offlineBorderColor = useColorModeValue('red.200', 'red.700');
  const offlineHoverBg = useColorModeValue('red.100', 'red.800');
  const systemHealthBg = useColorModeValue('green.50', 'green.900');
  const systemHealthBorder = useColorModeValue('green.200', 'green.700');
  const systemHealthText = useColorModeValue('green.700', 'green.300');
  const systemHealthSubtext = useColorModeValue('green.600', 'green.400');
  const batteryBg = useColorModeValue('blue.50', 'blue.900');
  const batteryBorder = useColorModeValue('blue.200', 'blue.700');
  const batteryText = useColorModeValue('blue.700', 'blue.300');
  const batterySubtext = useColorModeValue('blue.600', 'blue.400');

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
        const allCabs = allCabinetsRes.data?.list || [];
        const onlineCabs = allCabs.filter((c) => c.is_online === 1);
        const offlineCabs = allCabs.filter((c) => c.is_online === 0);

        setAllCabinets(allCabs);

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
      <Box>
        {/* System Health Skeleton */}
        <Card p={6} mb={6}>
          <Skeleton height="24px" width="200px" mb={4} />
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} p={4} borderWidth={1} borderRadius="md">
                <HStack>
                  <Skeleton height="24px" width="24px" borderRadius="full" />
                  <VStack align="start" spacing={1} flex={1}>
                    <Skeleton height="16px" width="60%" />
                    <Skeleton height="14px" width="80%" />
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Card>

        {/* Stats Cards Skeleton */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={6}>
          <DashboardStatsSkeleton />
        </Grid>

        {/* Monitoring Sections Skeleton */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mb={6}>
          <Card p={6}>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Skeleton height="24px" width="180px" />
                <Skeleton height="24px" width="24px" borderRadius="full" />
              </HStack>
              {Array.from({ length: 3 }).map((_, i) => (
                <CabinetCardSkeleton key={i} />
              ))}
            </VStack>
          </Card>
          <Card p={6}>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Skeleton height="24px" width="180px" />
                <Skeleton height="24px" width="24px" borderRadius="full" />
              </HStack>
              {Array.from({ length: 3 }).map((_, i) => (
                <CabinetCardSkeleton key={i} />
              ))}
            </VStack>
          </Card>
        </SimpleGrid>

        {/* Charts Section Skeleton */}
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={6} mb={6}>
          <Card p={6}>
            <ChartSkeleton />
          </Card>
          <Card p={6}>
            <ChartSkeleton />
          </Card>
          <Card p={6}>
            <ChartSkeleton />
          </Card>
        </SimpleGrid>

        {/* Map Skeleton */}
        <Box mb={6}>
          <Card p={6}>
            <MapSkeleton />
          </Card>
        </Box>

        {/* Revenue Chart Skeleton */}
        <Box mb={6}>
          <Card p={6}>
            <RevenueChartSkeleton />
          </Card>
        </Box>
      </Box>
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

  // Prepare chart data
  const getCabinetStatusData = () => {
    // Generate last 7 days data
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

      // Simulate historical data (in real app, fetch from API)
      const totalOnline = stats?.onlineCabinets || 0;
      const totalOffline = (stats?.totalCabinets || 0) - totalOnline;
      const variance = Math.floor(Math.random() * 3) - 1;

      data.push({
        date: dateStr,
        online: Math.max(0, totalOnline + variance),
        offline: Math.max(0, totalOffline - variance),
      });
    }
    return data;
  };

  const getBatteryLevelData = () => {
    // In real app, fetch from API with actual battery levels
    // For now, simulate data based on stats
    return [
      { range: '0-20%', count: Math.floor((stats?.totalBatteries || 0) * 0.1) },
      { range: '21-40%', count: Math.floor((stats?.totalBatteries || 0) * 0.15) },
      { range: '41-60%', count: Math.floor((stats?.totalBatteries || 0) * 0.2) },
      { range: '61-80%', count: Math.floor((stats?.totalBatteries || 0) * 0.25) },
      { range: '81-100%', count: Math.floor((stats?.totalBatteries || 0) * 0.3) },
    ];
  };

  const getCabinetModelData = () => {
    // Count cabinets by model
    const modelCounts: Record<string, number> = {};
    allCabinets.forEach((cabinet) => {
      const model = cabinet.model.toUpperCase();
      modelCounts[model] = (modelCounts[model] || 0) + 1;
    });

    return Object.entries(modelCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

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
  ];

  return (
    <Box>
      {/* System health */}
      <Card p={6} mb={6}>
        <Heading size="md" mb={4} color={textColor}>
          Estado del Sistema
        </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              bg={systemHealthBg}
              borderColor={systemHealthBorder}
              transition="all 0.2s"
              _hover={{ shadow: 'sm' }}
            >
              <HStack>
                <Icon as={MdCheckCircle} color="green.500" boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color={systemHealthText}>
                    API
                  </Text>
                  <Text fontSize="sm" color={systemHealthSubtext}>
                    Operacional
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              bg={systemHealthBg}
              borderColor={systemHealthBorder}
              transition="all 0.2s"
              _hover={{ shadow: 'sm' }}
            >
              <HStack>
                <Icon as={MdDevices} color="green.500" boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color={systemHealthText}>
                    Gabinetes
                  </Text>
                  <Text fontSize="sm" color={systemHealthSubtext}>
                    {stats?.onlineCabinets}/{stats?.totalCabinets} en línea
                  </Text>
                </VStack>
              </HStack>
            </Box>
            <Box
              p={4}
              borderWidth={1}
              borderRadius="md"
              bg={batteryBg}
              borderColor={batteryBorder}
              transition="all 0.2s"
              _hover={{ shadow: 'sm' }}
            >
              <HStack>
                <Icon as={MdBattery80} color="blue.500" boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color={batteryText}>
                    Baterías
                  </Text>
                  <Text fontSize="sm" color={batterySubtext}>
                    {stats?.availableBatteries} disponibles
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </SimpleGrid>
      </Card>

      {/* Stats Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} mb={6}>
        {statCards.map((card, index) => (
          <GridItem key={index}>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              shadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={card.icon} boxSize={8} color={`${card.color}.500`} mr={3} />
                <Box>
                  <Stat>
                    <StatLabel fontSize="sm" color={labelColor}>
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
        <Card p={6}>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="md" color={textColor}>Heartbeats Recientes</Heading>
              <Icon as={MdCheckCircle} boxSize={6} color="green.500" />
            </HStack>
            {recentCabinets.length === 0 ? (
              <Text color={emptyTextColor} textAlign="center" py={4}>
                No hay gabinetes con heartbeat reciente
              </Text>
            ) : (
              <VStack align="stretch" spacing={3}>
                {recentCabinets.map((cabinet) => (
                  <Box
                    key={cabinet.id}
                    p={3}
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius="md"
                    _hover={{ bg: hoverBg, cursor: 'pointer' }}
                    onClick={() => navigate(`/cabinets/${cabinet.cabinet_id}`)}
                    transition="all 0.2s"
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
                                <Text fontSize="xs" color={textSecondary}>
                                  {cabinet.signalStrength}/31
                                </Text>
                              </HStack>
                            )}
                          </HStack>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <Text fontSize="xs" color={labelColor}>
                            {cabinet.lastPingAt &&
                              new Date(cabinet.lastPingAt).toLocaleTimeString()}
                          </Text>
                          <Text fontSize="xs" color={textSecondary}>
                            {cabinet.connectionType?.toUpperCase() || 'N/A'}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </VStack>
        </Card>

        {/* Offline Cabinets */}
        <Card p={6}>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="md" color={textColor}>Gabinetes Offline</Heading>
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
                      borderColor={offlineBorderColor}
                      bg={offlineBg}
                      _hover={{ bg: offlineHoverBg, cursor: 'pointer' }}
                      onClick={() => navigate(`/cabinets/${cabinet.cabinet_id}`)}
                      transition="all 0.2s"
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{cabinet.cabinet_id}</Text>
                          <Badge colorScheme="red" size="sm">
                            OFFLINE
                          </Badge>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <Text fontSize="xs" color={textSecondary}>
                            {cabinet.lastPingAt
                              ? `Último: ${new Date(cabinet.lastPingAt).toLocaleString()}`
                              : 'Sin heartbeat'}
                          </Text>
                          {cabinet.address && (
                            <Text fontSize="xs" color={labelColor}>
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
        </Card>
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={6} mb={6}>
        {/* Cabinet Status Trend */}
        <Card p={6}>
          <VStack align="stretch" spacing={4}>
            <Heading size="md" color={textColor}>Tendencia de Gabinetes (7 días)</Heading>
            <CabinetStatusChart data={getCabinetStatusData()} />
          </VStack>
        </Card>

        {/* Battery Levels */}
        <Card p={6}>
          <VStack align="stretch" spacing={4}>
            <Heading size="md" color={textColor}>Distribución de Niveles de Batería</Heading>
            <BatteryLevelChart data={getBatteryLevelData()} />
          </VStack>
        </Card>

        {/* Cabinet Models */}
        <Card p={6}>
          <VStack align="stretch" spacing={4}>
            <Heading size="md" color={textColor}>Modelos de Gabinetes</Heading>
            <CabinetModelChart data={getCabinetModelData()} />
          </VStack>
        </Card>
      </SimpleGrid>

      {/* Cabinet Map - Full Width */}
      <Box mb={6}>
        <CabinetMap />
      </Box>

      {/* Revenue Chart - Full Width */}
      <Box mb={6}>
        <RevenueChart />
      </Box>
    </Box>
  );
}
