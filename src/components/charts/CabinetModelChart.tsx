import { useColorModeValue } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ModelData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface CabinetModelChartProps {
  data: ModelData[];
}

const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];

export function CabinetModelChart({ data }: CabinetModelChartProps) {
  const textColor = useColorModeValue('#2d3748', '#e2e8f0');
  const tooltipBg = useColorModeValue('#ffffff', '#2d3748');
  const tooltipBorder = useColorModeValue('#e2e8f0', '#4a5568');

  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '8px',
            color: textColor,
          }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
