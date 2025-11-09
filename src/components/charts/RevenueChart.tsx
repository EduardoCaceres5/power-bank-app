import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  ButtonGroup,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../common/Card';
import { RevenueStats } from '@/types/api.types';
import apiService from '@/services/api';
import { useMockRevenueData, isValidRevenueStats } from '@/hooks/useMockRevenueData';

type PeriodOption = '7d' | '30d' | '90d' | '1y';

interface RevenueChartProps {
  chartType?: 'line' | 'area';
}

const periodLabels: Record<PeriodOption, string> = {
  '7d': '7 días',
  '30d': '30 días',
  '90d': '90 días',
  '1y': '1 año',
};

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  if (active && payload && payload.length) {
    return (
      <Box
        bg={bgColor}
        p={3}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        shadow="lg"
      >
        <Text fontSize="sm" fontWeight="semibold" mb={2} color={textColor}>
          {new Date(label).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
        {payload.map((entry: any, index: number) => (
          <Flex key={index} align="center" gap={2} fontSize="sm">
            <Box
              w="12px"
              h="12px"
              borderRadius="full"
              bg={entry.color}
            />
            <Text color={textSecondary}>{entry.name}:</Text>
            <Text fontWeight="semibold" color={textColor}>
              ${entry.value?.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Text>
          </Flex>
        ))}
      </Box>
    );
  }
  return null;
}

export function RevenueChart({ chartType = 'area' }: RevenueChartProps) {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodOption>('30d');
  const [useMockData, setUseMockData] = useState(false);

  // Color mode values
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const emptyBg = useColorModeValue('gray.50', 'gray.700');
  const emptyBorder = useColorModeValue('gray.200', 'gray.600');
  const gridColor = useColorModeValue('#E5E7EB', '#4A5568');
  const axisColor = useColorModeValue('#6B7280', '#A0AEC0');

  // Generar datos de ejemplo
  const mockData = useMockRevenueData(period);

  useEffect(() => {
    loadRevenueStats();
  }, [period]);

  const loadRevenueStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getRevenueStats(period);

      if (response.success && response.data && isValidRevenueStats(response.data)) {
        setStats(response.data);
        setUseMockData(false);
      } else {
        console.warn('Revenue stats endpoint returned invalid data, using mock data');
        setStats(mockData);
        setUseMockData(true);
      }
    } catch (err) {
      console.warn('Error loading revenue stats, using mock data:', err);
      setStats(mockData);
      setUseMockData(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <Card p={6}>
        <Heading size="md" mb={4}>
          Ingresos por Período
        </Heading>
        <Flex align="center" justify="center" h="320px">
          <Text color="gray.500">Cargando datos...</Text>
        </Flex>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card p={6}>
        <Heading size="md" mb={4}>
          Ingresos por Período
        </Heading>
        <Flex align="center" justify="center" h="320px">
          <Text color="red.500">{error || 'No hay datos disponibles'}</Text>
        </Flex>
      </Card>
    );
  }

  const chartData = (stats.byDay && Array.isArray(stats.byDay))
    ? stats.byDay.map(item => ({
        date: item.date,
        ingresos: item.revenue,
        transacciones: item.count,
      }))
    : [];

  return (
    <Card p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={3}>
          <Heading size="md">Ingresos por Período</Heading>
          {useMockData && (
            <Badge colorScheme="yellow" fontSize="xs">
              Datos de ejemplo
            </Badge>
          )}
        </HStack>

        {/* Period selector */}
        <ButtonGroup size="sm" isAttached variant="outline">
          {(Object.keys(periodLabels) as PeriodOption[]).map((p) => (
            <Button
              key={p}
              onClick={() => setPeriod(p)}
              colorScheme={period === p ? 'blue' : 'gray'}
              variant={period === p ? 'solid' : 'outline'}
            >
              {periodLabels[p]}
            </Button>
          ))}
        </ButtonGroup>
      </Flex>

      {/* Summary Stats */}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
        <GridItem>
          <Box
            bgGradient={useColorModeValue(
              'linear(to-br, blue.50, blue.100)',
              'linear(to-br, blue.900, blue.800)'
            )}
            p={4}
            borderRadius="lg"
          >
            <Text fontSize="sm" color={useColorModeValue('blue.600', 'blue.200')} fontWeight="medium" mb={1}>
              Total
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('blue.900', 'blue.50')}>
              {formatCurrency(stats.totalRevenue || 0)}
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bgGradient={useColorModeValue(
              'linear(to-br, green.50, green.100)',
              'linear(to-br, green.900, green.800)'
            )}
            p={4}
            borderRadius="lg"
          >
            <Text fontSize="sm" color={useColorModeValue('green.600', 'green.200')} fontWeight="medium" mb={1}>
              Hoy
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('green.900', 'green.50')}>
              {formatCurrency(stats.todayRevenue || 0)}
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bgGradient={useColorModeValue(
              'linear(to-br, purple.50, purple.100)',
              'linear(to-br, purple.900, purple.800)'
            )}
            p={4}
            borderRadius="lg"
          >
            <Text fontSize="sm" color={useColorModeValue('purple.600', 'purple.200')} fontWeight="medium" mb={1}>
              Esta semana
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('purple.900', 'purple.50')}>
              {formatCurrency(stats.weekRevenue || 0)}
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bgGradient={useColorModeValue(
              'linear(to-br, orange.50, orange.100)',
              'linear(to-br, orange.900, orange.800)'
            )}
            p={4}
            borderRadius="lg"
          >
            <Text fontSize="sm" color={useColorModeValue('orange.600', 'orange.200')} fontWeight="medium" mb={1}>
              Este mes
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('orange.900', 'orange.50')}>
              {formatCurrency(stats.monthRevenue || 0)}
            </Text>
          </Box>
        </GridItem>
      </Grid>

      {/* Chart */}
      {chartData.length === 0 ? (
        <Flex
          align="center"
          justify="center"
          h="320px"
          bg={emptyBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={emptyBorder}
        >
          <VStack>
            <Text color={textSecondary} mb={2}>
              No hay datos de ingresos disponibles
            </Text>
            <Text fontSize="sm" color={textSecondary}>
              El endpoint /admin/revenue/stats puede no estar implementado
            </Text>
          </VStack>
        </Flex>
      ) : (
        <Box h="320px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke={axisColor}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke={axisColor}
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                name="Ingresos"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Revenue by Type */}
      {stats.byType && Array.isArray(stats.byType) && stats.byType.length > 0 && (
        <Box mt={6} pt={6} borderTopWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
          <Heading size="sm" mb={3} color={textColor}>
            Desglose por tipo de transacción
          </Heading>
          <Grid templateColumns="repeat(5, 1fr)" gap={3}>
            {stats.byType.map((item) => (
              <Box
                key={item.type}
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={3}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <Text fontSize="xs" color={textSecondary} mb={1}>
                  {item.type.replace('_', ' ')}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  {formatCurrency(item.total)}
                </Text>
                <Text fontSize="xs" color={textSecondary} mt={1}>
                  {item.count} transaccion{item.count !== 1 ? 'es' : ''}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      )}

      {/* Average Transaction */}
      <Flex mt={4} fontSize="sm" color={textSecondary} justify="space-between" align="center">
        <Text>Promedio por transacción:</Text>
        <Text fontWeight="semibold" color={textColor}>
          {formatCurrency(stats.averageTransaction || 0)}
        </Text>
      </Flex>
    </Card>
  );
}
