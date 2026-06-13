import Header from '@/components/layout/Header';
import MetricCard from '@/components/common/MetricCard';
import Card from '@/components/common/Card';
import TrendChart from '@/components/charts/TrendChart';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';
import { Users, CheckCircle, Eye, MessageCircle, FileText, ShoppingCart, Calendar, Target, Wallet, Share2 } from 'lucide-react';
import { useActivityStore } from '@/store/activityStore';
import { trendData, cityDistribution, industryDistribution, customerLevelDistribution } from '@/data/charts';
import { formatCurrency, calculateROI, calculateCPA } from '@/utils/format';
import { useState } from 'react';
import Select from '@/components/common/Select';

export default function Overview() {
  const { currentActivity } = useActivityStore();
  const [distributionType, setDistributionType] = useState<'city' | 'industry' | 'level'>('city');

  if (!currentActivity) return null;

  const metrics = currentActivity.metrics;
  const target = currentActivity.target;
  const roi = calculateROI(metrics.dealAmount, currentActivity.budget);
  const cpa = calculateCPA(currentActivity.budget, metrics.leads);

  const distributionData = {
    city: cityDistribution,
    industry: industryDistribution,
    level: customerLevelDistribution,
  };

  return (
    <div className="space-y-6">
      <Header
        title={currentActivity.name}
        subtitle={`${currentActivity.startDate} · ${currentActivity.type === 'launch' ? '发布会' : currentActivity.type === 'exhibition' ? '展会' : '直播'}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="活动配置" className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#2a4a6a]/20">
              <Calendar className="w-5 h-5 text-[#ff6b35]" />
              <div>
                <p className="text-xs text-[#6a8aaa]">活动时间</p>
                <p className="text-sm font-medium text-white">{currentActivity.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#2a4a6a]/20">
              <Target className="w-5 h-5 text-[#00d4aa]" />
              <div>
                <p className="text-xs text-[#6a8aaa]">报名目标</p>
                <p className="text-sm font-medium text-white">{target.registrations.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#2a4a6a]/20">
              <Wallet className="w-5 h-5 text-[#2d5a87]" />
              <div>
                <p className="text-xs text-[#6a8aaa]">活动预算</p>
                <p className="text-sm font-medium text-white">{formatCurrency(currentActivity.budget)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#2a4a6a]/20">
              <Share2 className="w-5 h-5 text-[#9b59b6]" />
              <div>
                <p className="text-xs text-[#6a8aaa]">渠道数量</p>
                <p className="text-sm font-medium text-white">{currentActivity.channels.length} 个</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="报名人数"
          value={metrics.registrations}
          target={target.registrations}
          icon={<Users className="w-5 h-5 text-[#ff6b35]" />}
          color="orange"
          trend={7.5}
        />
        <MetricCard
          title="签到人数"
          value={metrics.checkIns}
          target={target.checkIns}
          icon={<CheckCircle className="w-5 h-5 text-[#00d4aa]" />}
          color="green"
          trend={6.7}
        />
        <MetricCard
          title="观看人数"
          value={metrics.viewers}
          icon={<Eye className="w-5 h-5 text-[#2d5a87]" />}
          color="blue"
        />
        <MetricCard
          title="互动次数"
          value={metrics.interactions}
          icon={<MessageCircle className="w-5 h-5 text-[#9b59b6]" />}
          color="purple"
          trend={12.3}
        />
        <MetricCard
          title="留资人数"
          value={metrics.leads}
          target={target.leads}
          icon={<FileText className="w-5 h-5 text-[#ff6b35]" />}
          color="orange"
          trend={25}
        />
        <MetricCard
          title="成交人数"
          value={metrics.deals}
          target={target.deals}
          icon={<ShoppingCart className="w-5 h-5 text-[#00d4aa]" />}
          color="green"
          trend={27.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="核心成效指标" className="lg:col-span-1">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#00d4aa]/20 to-[#00b894]/10 border border-[#00d4aa]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6a8aaa]">投资回报率 (ROI)</span>
                <span className="text-2xl font-bold text-[#00d4aa]">{roi.toFixed(1)}%</span>
              </div>
              <div className="mt-2 text-xs text-[#6a8aaa]">
                成交金额 {formatCurrency(metrics.dealAmount)} / 预算 {formatCurrency(currentActivity.budget)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c5a]/10 border border-[#ff6b35]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6a8aaa]">获客成本 (CPA)</span>
                <span className="text-2xl font-bold text-[#ff6b35]">{formatCurrency(cpa)}</span>
              </div>
              <div className="mt-2 text-xs text-[#6a8aaa]">
                预算 {formatCurrency(currentActivity.budget)} / 留资 {metrics.leads} 人
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#2a4a6a]/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6a8aaa]">成交金额</span>
                <span className="text-2xl font-bold text-white">{formatCurrency(metrics.dealAmount)}</span>
              </div>
              <div className="mt-2 text-xs text-[#6a8aaa]">
                平均客单价 {formatCurrency(metrics.dealAmount / metrics.deals)}
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <TrendChart data={trendData} title="热度趋势" height={280} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card 
          title="人群分布" 
          action={
            <Select
              value={distributionType}
              onChange={(v) => setDistributionType(v as 'city' | 'industry' | 'level')}
              options={[
                { value: 'city', label: '按城市' },
                { value: 'industry', label: '按行业' },
                { value: 'level', label: '按客户等级' },
              ]}
            />
          }
        >
          <PieChart
            data={distributionData[distributionType]}
            height={280}
            innerRadius={80}
          />
        </Card>

        <BarChart
          data={distributionData[distributionType].slice(0, 6)}
          title="TOP 6 分布详情"
          height={280}
        />
      </div>
    </div>
  );
}