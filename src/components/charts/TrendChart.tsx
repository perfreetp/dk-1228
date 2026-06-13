import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/common/Card';

interface TrendChartProps {
  data: { time: string; value: number }[];
  title?: string;
  color?: string;
  height?: number;
}

export default function TrendChart({ data, title, color = '#ff6b35', height = 300 }: TrendChartProps) {
  return (
    <Card title={title} subtitle="活动期间热度变化">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6a8aaa', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6a8aaa', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2d4a',
              border: '1px solid #2a4a6a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: 12,
            }}
            labelStyle={{ color: '#6a8aaa' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#colorGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}