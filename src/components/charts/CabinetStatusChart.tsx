import { useColorModeValue } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CabinetStatusData {
  date: string;
  online: number;
  offline: number;
}

interface CabinetStatusChartProps {
  data: CabinetStatusData[];
}

export function CabinetStatusChart({ data }: CabinetStatusChartProps) {
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568');
  const textColor = useColorModeValue('#2d3748', '#e2e8f0');
  const tooltipBg = useColorModeValue('#ffffff', '#2d3748');
  const tooltipBorder = useColorModeValue('#e2e8f0', '#4a5568');

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          stroke={textColor}
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke={textColor} style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: textColor,
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
        <Line
          type="monotone"
          dataKey="online"
          stroke="#48bb78"
          strokeWidth={2}
          name="En Línea"
          dot={{ fill: '#48bb78', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="offline"
          stroke="#f56565"
          strokeWidth={2}
          name="Fuera de Línea"
          dot={{ fill: '#f56565', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
