import Card from '@/components/common/Card';
import { formatNumber, formatPercent } from '@/utils/format';
import { cn } from '@/lib/utils';
import { TrendingDown, AlertTriangle } from 'lucide-react';

interface FunnelData {
  stage: string;
  count: number;
  rate: number;
  dropRate: number;
}

interface FunnelChartProps {
  data: FunnelData[];
  title?: string;
  height?: number;
}

const stageColors = [
  'from-[#ff6b35] to-[#ff8c5a]',
  'from-[#ff8c5a] to-[#ffb380]',
  'from-[#ffb380] to-[#ffd4b8]',
  'from-[#ffd4b8] to-[#ffe8d8]',
  'from-[#ffe8d8] to-[#fff4ed]',
  'from-[#fff4ed] to-[#fff9f5]',
];

export default function FunnelChart({ data, title, height = 400 }: FunnelChartProps) {
  const maxCount = data[0]?.count || 0;

  return (
    <Card title={title} subtitle="全流程转化分析">
      <div className="space-y-3" style={{ height }}>
        {data.map((item, index) => {
          const widthPercent = (item.count / maxCount) * 100;
          const isHighDrop = item.dropRate > 30;

          return (
            <div key={item.stage} className="relative group">
              <div className="flex items-center gap-4">
                <div className="w-24 text-right">
                  <span className="text-sm font-medium text-white">{item.stage}</span>
                </div>
                
                <div className="flex-1 relative">
                  <div
                    className={cn(
                      'h-12 rounded-lg bg-gradient-to-r transition-all duration-500 relative overflow-hidden',
                      stageColors[index]
                    )}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-[#0f1a2d]/30" />
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <span className="text-sm font-bold text-white tabular-nums">{formatNumber(item.count)}</span>
                      <span className="text-sm font-medium text-white/80 tabular-nums">{formatPercent(item.rate)}</span>
                    </div>
                  </div>
                  
                  {isHighDrop && index > 0 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#ff4757] opacity-0 group-hover:opacity-100 transition-opacity">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">流失{formatPercent(item.dropRate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {index > 0 && (
                <div className="flex items-center gap-4 ml-24 mt-1">
                  <div className="flex-1 flex items-center gap-2">
                    <TrendingDown className={cn('w-3 h-3', isHighDrop ? 'text-[#ff4757]' : 'text-[#6a8aaa]')} />
                    <span className={cn('text-xs', isHighDrop ? 'text-[#ff4757]' : 'text-[#6a8aaa]')}>
                      较上一环节流失 {formatPercent(item.dropRate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[#2a4a6a]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ff4757]" />
            <span className="text-sm text-[#6a8aaa]">高流失节点已标记，建议重点关注</span>
          </div>
          <div className="text-sm text-[#6a8aaa]">
            整体转化率: <span className="text-[#00d4aa] font-bold">{formatPercent(data[data.length - 1]?.rate || 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}