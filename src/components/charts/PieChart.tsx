import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '@/components/common/Card';
import { formatPercent } from '@/utils/format';

interface PieChartData {
  name: string;
  value: number;
  percentage?: number;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  subtitle?: string;
  height?: number;
  colors?: string[];
  innerRadius?: number;
}

const defaultColors = ['#ff6b35', '#00d4aa', '#2d5a87', '#ff4757', '#9b59b6', '#f39c12', '#1abc9c', '#e74c3c'];

export default function PieChart({ data, title, subtitle, height = 300, colors = defaultColors, innerRadius = 60 }: PieChartProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={height / 2 - 20}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2d4a',
              border: '1px solid #2a4a6a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [formatPercent(value / data.reduce((a, b) => a + b.value, 0) * 100), name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => <span className="text-[#6a8aaa] text-sm">{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Card>
  );
}