import { useColorModeValue } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BatteryLevelData {
  range: string;
  count: number;
}

interface BatteryLevelChartProps {
  data: BatteryLevelData[];
}

const COLORS = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#38b2ac'];

export function BatteryLevelChart({ data }: BatteryLevelChartProps) {
  const gridColor = useColorModeValue('#e2e8f0', '#4a5568');
  const textColor = useColorModeValue('#2d3748', '#e2e8f0');
  const tooltipBg = useColorModeValue('#ffffff', '#2d3748');
  const tooltipBorder = useColorModeValue('#e2e8f0', '#4a5568');

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="range"
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
        <Bar dataKey="count" name="Baterías" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
