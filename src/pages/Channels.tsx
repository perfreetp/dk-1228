import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import BarChart from '@/components/charts/BarChart';
import { useActivityStore } from '@/store/activityStore';
import { formatCurrency, formatPercent, calculateROI, calculateConversionRate } from '@/utils/format';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const channelColors: Record<string, string> = {
  wechat: '#ff6b35',
  weibo: '#00d4aa',
  email: '#2d5a87',
  sms: '#9b59b6',
  ads: '#f39c12',
  offline: '#1abc9c',
  other: '#e74c3c',
};

export default function Channels() {
  const { currentActivity, activities } = useActivityStore();
  const [compareActivity, setCompareActivity] = useState<string>('');

  if (!currentActivity) return null;

  const channels = currentActivity.channels;
  const totalCost = channels.reduce((sum, c) => sum + c.cost, 0);

  const channelData = channels.map((c) => ({
    name: c.name,
    value: c.registrations,
    color: channelColors[c.type],
  }));

  const roiData = channels.map((c) => {
    const revenue = c.deals * (currentActivity.metrics.dealAmount / currentActivity.metrics.deals);
    const roi = calculateROI(revenue, c.cost);
    return {
      name: c.name,
      value: roi,
      color: roi > 100 ? '#00d4aa' : roi > 50 ? '#ff6b35' : '#ff4757',
    };
  });

  const compareData = compareActivity
    ? activities.find((a) => a.id === compareActivity)?.channels.map((c) => ({
        name: c.name,
        value: c.registrations,
        color: channelColors[c.type],
      }))
    : null;

  return (
    <div className="space-y-6">
      <Header title="渠道分析" subtitle="各渠道来源效果对比" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#ff6b35]/20">
              <DollarSign className="w-6 h-6 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-xs text-[#6a8aaa]">总投入成本</p>
              <p className="text-xl font-bold text-white">{formatCurrency(totalCost)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#00d4aa]/20">
              <Users className="w-6 h-6 text-[#00d4aa]" />
            </div>
            <div>
              <p className="text-xs text-[#6a8aaa]">总报名数</p>
              <p className="text-xl font-bold text-white">{channels.reduce((s, c) => s + c.registrations, 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#2d5a87]/30">
              <Target className="w-6 h-6 text-[#2d5a87]" />
            </div>
            <div>
              <p className="text-xs text-[#6a8aaa]">平均转化率</p>
              <p className="text-xl font-bold text-white">
                {formatPercent(
                  channels.reduce((s, c) => s + calculateConversionRate(c.registrations, c.deals), 0) / channels.length
                )}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#9b59b6]/20">
              <TrendingUp className="w-6 h-6 text-[#9b59b6]" />
            </div>
            <div>
              <p className="text-xs text-[#6a8aaa]">最高ROI渠道</p>
              <p className="text-xl font-bold text-white">
                {channels.sort((a, b) => calculateROI(b.deals * 50000, b.cost) - calculateROI(a.deals * 50000, a.cost))[0]?.name}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="渠道效果对比">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a4a6a]/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">渠道名称</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">投入成本</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">报名数</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">签到数</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">留资数</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">成交数</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">转化率</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">ROI</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => {
                const convRate = calculateConversionRate(channel.registrations, channel.deals);
                const revenue = channel.deals * (currentActivity.metrics.dealAmount / currentActivity.metrics.deals);
                const roi = calculateROI(revenue, channel.cost);

                return (
                  <tr key={channel.id} className="border-b border-[#2a4a6a]/20 hover:bg-[#2a4a6a]/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channelColors[channel.type] }} />
                        <span className="text-sm font-medium text-white">{channel.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{formatCurrency(channel.cost)}</td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.registrations.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.checkIns.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.leads.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.deals.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn('text-sm font-medium tabular-nums', convRate > 10 ? 'text-[#00d4aa]' : convRate > 5 ? 'text-[#ff6b35]' : 'text-[#ff4757]')}>
                        {formatPercent(convRate)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {roi > 100 ? <TrendingUp className="w-4 h-4 text-[#00d4aa]" /> : <TrendingDown className="w-4 h-4 text-[#ff4757]" />}
                        <span className={cn('text-sm font-medium tabular-nums', roi > 100 ? 'text-[#00d4aa]' : 'text-[#ff4757]')}>
                          {roi.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          data={channelData}
          title="渠道报名数分布"
          height={280}
        />
        <BarChart
          data={roiData}
          title="渠道ROI对比"
          subtitle="投资回报率分析"
          height={280}
        />
      </div>

      <Card title="场次对比" subtitle="与历史活动渠道效果对比">
        <div className="mb-4">
          <select
            value={compareActivity}
            onChange={(e) => setCompareActivity(e.target.value)}
            className="bg-[#2a4a6a]/20 border border-[#2a4a6a]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b35]/50"
          >
            <option value="" className="bg-[#1a2d4a]">选择对比活动</option>
            {activities.filter((a) => a.id !== currentActivity.id).map((a) => (
              <option key={a.id} value={a.id} className="bg-[#1a2d4a]">{a.name}</option>
            ))}
          </select>
        </div>

        {compareData && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#6a8aaa] mb-2">当前活动: {currentActivity.name}</p>
              <BarChart data={channelData} height={200} />
            </div>
            <div>
              <p className="text-sm text-[#6a8aaa] mb-2">对比活动: {activities.find((a) => a.id === compareActivity)?.name}</p>
              <BarChart data={compareData} height={200} />
            </div>
          </div>
        )}

        {!compareData && (
          <div className="flex items-center justify-center h-40 text-[#6a8aaa]">
            <ArrowRight className="w-5 h-5 mr-2" />
            <span>选择一个历史活动进行对比分析</span>
          </div>
        )}
      </Card>

      <Card title="渠道转化漏斗" subtitle="单渠道转化路径分析">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.slice(0, 6).map((channel) => {
            const stages = [
              { name: '报名', count: channel.registrations },
              { name: '签到', count: channel.checkIns },
              { name: '留资', count: channel.leads },
              { name: '成交', count: channel.deals },
            ];
            const maxCount = stages[0].count;

            return (
              <div key={channel.id} className="p-4 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channelColors[channel.type] }} />
                  <span className="text-sm font-medium text-white">{channel.name}</span>
                </div>
                <div className="space-y-2">
                  {stages.map((stage, i) => (
                    <div key={stage.name} className="flex items-center gap-2">
                      <span className="text-xs text-[#6a8aaa] w-12">{stage.name}</span>
                      <div
                        className="h-6 rounded bg-gradient-to-r opacity-80"
                        style={{
                          width: `${(stage.count / maxCount) * 100}%`,
                          backgroundColor: channelColors[channel.type],
                        }}
                      />
                      <span className="text-xs text-white tabular-nums">{stage.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}