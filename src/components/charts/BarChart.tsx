import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '@/components/common/Card';
import { formatNumber } from '@/utils/format';

interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  subtitle?: string;
  height?: number;
  horizontal?: boolean;
}

const defaultColors = ['#ff6b35', '#00d4aa', '#2d5a87', '#ff4757', '#9b59b6', '#f39c12'];

export default function BarChart({ data, title, subtitle, height = 300, horizontal = false }: BarChartProps) {
  const dataWithColors = data.map((d, i) => ({
    ...d,
    color: d.color || defaultColors[i % defaultColors.length],
  }));

  return (
    <Card title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={dataWithColors}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 10, left: horizontal ? 80 : -20, bottom: 0 }}
        >
          <XAxis
            type={horizontal ? 'number' : 'category'}
            dataKey={horizontal ? 'value' : 'name'}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6a8aaa', fontSize: 12 }}
            dy={horizontal ? 0 : 10}
            dx={horizontal ? -10 : 0}
            tickFormatter={horizontal ? formatNumber : undefined}
          />
          <YAxis
            type={horizontal ? 'category' : 'number'}
            dataKey={horizontal ? 'name' : 'value'}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6a8aaa', fontSize: 12 }}
            width={horizontal ? 80 : 40}
            tickFormatter={horizontal ? undefined : formatNumber}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2d4a',
              border: '1px solid #2a4a6a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(value: number) => formatNumber(value)}
          />
          <Bar
            dataKey="value"
            radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
            animationDuration={1000}
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
}