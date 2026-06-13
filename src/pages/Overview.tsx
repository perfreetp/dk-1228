import Header from '@/components/layout/Header';
import MetricCard from '@/components/common/MetricCard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TrendChart from '@/components/charts/TrendChart';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';
import { Users, CheckCircle, Eye, MessageCircle, FileText, ShoppingCart, Calendar, Target, Wallet, Share2, Settings, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useActivityStore } from '@/store/activityStore';
import { trendData, cityDistribution, industryDistribution, customerLevelDistribution } from '@/data/charts';
import { formatCurrency, calculateROI, calculateCPA } from '@/utils/format';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Channel, ChannelType } from '@/types';

const channelTypes: { value: ChannelType; label: string }[] = [
  { value: 'wechat', label: '微信公众号' },
  { value: 'weibo', label: '微博推广' },
  { value: 'email', label: '邮件营销' },
  { value: 'sms', label: '短信通知' },
  { value: 'ads', label: '信息流广告' },
  { value: 'offline', label: '线下推广' },
  { value: 'other', label: '其他' },
];

const channelColors: Record<string, string> = {
  wechat: '#ff6b35',
  weibo: '#00d4aa',
  email: '#2d5a87',
  sms: '#9b59b6',
  ads: '#f39c12',
  offline: '#1abc9c',
  other: '#e74c3c',
};

export default function Overview() {
  const { currentActivity, editingActivity, isEditing, startEditing, cancelEditing, saveEditing, updateEditingField, updateEditingTarget, addChannel, updateChannel, deleteChannel } = useActivityStore();
  const [distributionType, setDistributionType] = useState<'city' | 'industry' | 'level'>('city');
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [newChannel, setNewChannel] = useState<Partial<Channel>>({
    name: '',
    type: 'wechat',
    cost: 0,
    registrations: 0,
    checkIns: 0,
    leads: 0,
    deals: 0,
  });

  if (!currentActivity) return null;

  const activity = isEditing && editingActivity ? editingActivity : currentActivity;
  const metrics = activity.metrics;
  const target = activity.target;
  const roi = calculateROI(metrics.dealAmount, activity.budget);
  const cpa = calculateCPA(activity.budget, metrics.leads);

  const distributionData = {
    city: cityDistribution,
    industry: industryDistribution,
    level: customerLevelDistribution,
  };

  const handleAddChannel = () => {
    if (newChannel.name && newChannel.cost !== undefined) {
      addChannel({
        name: newChannel.name,
        type: newChannel.type || 'other',
        cost: newChannel.cost,
        registrations: newChannel.registrations || 0,
        checkIns: newChannel.checkIns || 0,
        leads: newChannel.leads || 0,
        deals: newChannel.deals || 0,
      });
      setNewChannel({ name: '', type: 'wechat', cost: 0, registrations: 0, checkIns: 0, leads: 0, deals: 0 });
      setShowAddChannel(false);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    if (confirm('确定要删除此渠道吗？')) {
      deleteChannel(channelId);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title={activity.name}
        subtitle={`${activity.startDate} · ${activity.type === 'launch' ? '发布会' : activity.type === 'exhibition' ? '展会' : '直播'}`}
      />

      <Card title="活动配置" action={
        isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={cancelEditing} icon={<X className="w-4 h-4" />}>取消</Button>
            <Button variant="primary" size="sm" onClick={saveEditing} icon={<Check className="w-4 h-4" />}>保存</Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={startEditing} icon={<Settings className="w-4 h-4" />}>编辑配置</Button>
        )
      }>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-[#6a8aaa] mb-1 block">活动名称</label>
              {isEditing ? (
                <Input
                  value={editingActivity?.name || ''}
                  onChange={(v) => updateEditingField('name', v)}
                />
              ) : (
                <p className="text-white font-medium">{activity.name}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#6a8aaa] mb-1 block">活动日期</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editingActivity?.startDate || ''}
                  onChange={(v) => updateEditingField('startDate', v)}
                />
              ) : (
                <p className="text-white font-medium">{activity.startDate}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#6a8aaa] mb-1 block">活动类型</label>
              {isEditing ? (
                <Select
                  value={editingActivity?.type || 'launch'}
                  onChange={(v) => updateEditingField('type', v as 'launch' | 'exhibition' | 'livestream')}
                  options={[
                    { value: 'launch', label: '发布会' },
                    { value: 'exhibition', label: '展会' },
                    { value: 'livestream', label: '直播' },
                  ]}
                />
              ) : (
                <p className="text-white font-medium">
                  {activity.type === 'launch' ? '发布会' : activity.type === 'exhibition' ? '展会' : '直播'}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#6a8aaa] mb-1 block">总预算</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={String(editingActivity?.budget || 0)}
                  onChange={(v) => updateEditingField('budget', Number(v))}
                />
              ) : (
                <p className="text-white font-medium">{formatCurrency(activity.budget)}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#ff6b35]" />
              活动目标
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['registrations', 'checkIns', 'leads', 'deals'] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs text-[#6a8aaa] mb-1 block">
                    {field === 'registrations' ? '报名人数' : field === 'checkIns' ? '签到人数' : field === 'leads' ? '留资人数' : '成交人数'}
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={String(editingActivity?.target[field] || 0)}
                      onChange={(v) => updateEditingTarget(field, Number(v))}
                    />
                  ) : (
                    <p className="text-white font-medium">{target[field].toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#00d4aa]" />
                渠道配置
                <span className="text-xs text-[#6a8aaa]">（共 {activity.channels.length} 个渠道）</span>
              </h4>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setShowAddChannel(true)} icon={<Plus className="w-4 h-4" />}>
                  新增渠道
                </Button>
              )}
            </div>

            {showAddChannel && isEditing && (
              <div className="p-4 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30 mb-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Input
                    value={newChannel.name || ''}
                    onChange={(v) => setNewChannel({ ...newChannel, name: v })}
                    placeholder="渠道名称"
                  />
                  <Select
                    value={newChannel.type || 'wechat'}
                    onChange={(v) => setNewChannel({ ...newChannel, type: v as ChannelType })}
                    options={channelTypes}
                  />
                  <Input
                    type="number"
                    value={String(newChannel.cost || 0)}
                    onChange={(v) => setNewChannel({ ...newChannel, cost: Number(v) })}
                    placeholder="投入成本"
                  />
                  <Input
                    type="number"
                    value={String(newChannel.registrations || 0)}
                    onChange={(v) => setNewChannel({ ...newChannel, registrations: Number(v) })}
                    placeholder="报名数"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowAddChannel(false)}>取消</Button>
                  <Button variant="primary" size="sm" onClick={handleAddChannel}>添加</Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {activity.channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[#2a4a6a]/10 border border-[#2a4a6a]/20"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channelColors[channel.type] }} />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <span className="text-[#6a8aaa]">渠道名称</span>
                      {isEditing && editingChannelId === channel.id ? (
                        <Input
                          value={channel.name}
                          onChange={(v) => updateChannel(channel.id, { name: v })}
                          onBlur={() => setEditingChannelId(null)}
                        />
                      ) : (
                        <p className="text-white font-medium">{channel.name}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[#6a8aaa]">投入成本</span>
                      <p className="text-white font-medium">{formatCurrency(channel.cost)}</p>
                    </div>
                    <div>
                      <span className="text-[#6a8aaa]">报名数</span>
                      <p className="text-white font-medium">{channel.registrations.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[#6a8aaa]">留资数</span>
                      <p className="text-white font-medium">{channel.leads.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[#6a8aaa]">成交数</span>
                      <p className="text-white font-medium">{channel.deals.toLocaleString()}</p>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingChannelId(channel.id)}
                        className="p-2 rounded-lg hover:bg-[#2a4a6a]/30 text-[#6a8aaa] hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteChannel(channel.id)}
                        className="p-2 rounded-lg hover:bg-[#ff4757]/20 text-[#6a8aaa] hover:text-[#ff4757] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

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
                成交金额 {formatCurrency(metrics.dealAmount)} / 预算 {formatCurrency(activity.budget)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#ff6b35]/20 to-[#ff8c5a]/10 border border-[#ff6b35]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6a8aaa]">获客成本 (CPA)</span>
                <span className="text-2xl font-bold text-[#ff6b35]">{formatCurrency(cpa)}</span>
              </div>
              <div className="mt-2 text-xs text-[#6a8aaa]">
                预算 {formatCurrency(activity.budget)} / 留资 {metrics.leads} 人
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