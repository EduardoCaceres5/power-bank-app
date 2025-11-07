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
} from '@chakra-ui/react';
import { MdDevices, MdBattery80, MdCheckCircle, MdCalendarToday } from 'react-icons/md';
import { apiService } from '@/services/api';
import type { DashboardStats } from '@/types/api.types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      const [cabinetsRes, batteriesRes, plansRes] = await Promise.all([
        apiService.getCabinets({ page: 1, page_size: 1 }),
        apiService.getBatteries({ page: 1, page_size: 1 }),
        apiService.getPlans({ page: 1 }),
      ]);

      if (cabinetsRes.success && batteriesRes.success && plansRes.success) {
        setStats({
          totalCabinets: cabinetsRes.data?.total || 0,
          onlineCabinets: cabinetsRes.data?.list.filter((c) => c.is_online === 1).length || 0,
          totalBatteries: batteriesRes.data?.total || 0,
          availableBatteries:
            batteriesRes.data?.list.filter((b) => b.status === 'available').length || 0,
          activePlans: plansRes.data?.total || 0,
        });
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

      {/* Additional dashboard content can be added here */}
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Actividad Reciente
            </Text>
            <Text color="gray.500">No hay actividad reciente para mostrar</Text>
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Acciones Rápidas
            </Text>
            <Text color="gray.500">Próximamente...</Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
