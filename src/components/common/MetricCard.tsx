import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercent, formatCurrency } from '@/utils/format';

interface MetricCardProps {
  title: string;
  value: number;
  target?: number;
  unit?: 'number' | 'percent' | 'currency';
  trend?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorStyles = {
  blue: 'from-[#2d5a87] to-[#1e3a5f] border-[#3a6a9f]/30',
  green: 'from-[#00d4aa]/20 to-[#00b894]/10 border-[#00d4aa]/30',
  orange: 'from-[#ff6b35]/20 to-[#ff8c5a]/10 border-[#ff6b35]/30',
  red: 'from-[#ff4757]/20 to-[#ff6b6b]/10 border-[#ff4757]/30',
  purple: 'from-[#9b59b6]/20 to-[#8e44ad]/10 border-[#9b59b6]/30',
};

const iconBgStyles = {
  blue: 'bg-[#2d5a87]/30',
  green: 'bg-[#00d4aa]/20',
  orange: 'bg-[#ff6b35]/20',
  red: 'bg-[#ff4757]/20',
  purple: 'bg-[#9b59b6]/20',
};

const TrendIcon = ({ trend }: { trend: number }) => {
  if (trend > 0) return <TrendingUp className="w-4 h-4" />;
  if (trend < 0) return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

export default function MetricCard({ title, value, target, unit = 'number', trend, icon, color = 'blue' }: MetricCardProps) {
  const formatValue = () => {
    switch (unit) {
      case 'percent':
        return formatPercent(value);
      case 'currency':
        return formatCurrency(value);
      default:
        return formatNumber(value);
    }
  };

  const progress = target ? Math.min((value / target) * 100, 100) : undefined;
  const trendColor = trend !== undefined ? (trend > 0 ? 'text-[#00d4aa]' : trend < 0 ? 'text-[#ff4757]' : 'text-[#6a8aaa]') : '';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br border backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group',
        colorStyles[color]
      )}
    >
      <div className="absolute inset-0 bg-[#0f1a2d]/40 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-2.5 rounded-xl', iconBgStyles[color])}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
              <TrendIcon trend={trend} />
              <span>{formatPercent(Math.abs(trend))}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-[#6a8aaa] font-medium">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight tabular-nums">{formatValue()}</p>
        </div>

        {target && progress !== undefined && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6a8aaa]">目标: {formatNumber(target)}</span>
              <span className={cn('font-medium', progress >= 100 ? 'text-[#00d4aa]' : 'text-[#ff6b35]')}>
                {formatPercent(progress)}
              </span>
            </div>
            <div className="h-1.5 bg-[#2a4a6a]/30 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progress >= 100 ? 'bg-gradient-to-r from-[#00d4aa] to-[#00b894]' : 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a]'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
}