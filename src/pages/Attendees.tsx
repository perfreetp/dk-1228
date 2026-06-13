import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAttendeeStore } from '@/store/attendeeStore';
import { formatDuration, formatCurrency } from '@/utils/format';
import { exportToCSV } from '@/utils/export';
import { Search, Download, X, Users, Building, MapPin, Tag, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { CustomerLevel, AttendeeStatus } from '@/types';

const statusLabels: Record<AttendeeStatus, string> = {
  registered: '已报名',
  'checked-in': '已签到',
  viewed: '已观看',
  interacted: '已互动',
  lead: '已留资',
  deal: '已成交',
};

const statusColors: Record<AttendeeStatus, string> = {
  registered: 'bg-[#6a8aaa]/20 text-[#6a8aaa]',
  'checked-in': 'bg-[#2d5a87]/20 text-[#2d5a87]',
  viewed: 'bg-[#9b59b6]/20 text-[#9b59b6]',
  interacted: 'bg-[#ff6b35]/20 text-[#ff6b35]',
  lead: 'bg-[#00d4aa]/20 text-[#00d4aa]',
  deal: 'bg-[#00d4aa]/30 text-[#00d4aa]',
};

const levelLabels: Record<CustomerLevel, string> = {
  A: 'A级',
  B: 'B级',
  C: 'C级',
  D: 'D级',
  new: '新客户',
};

const levelColors: Record<CustomerLevel, string> = {
  A: 'bg-[#ff6b35]/20 text-[#ff6b35]',
  B: 'bg-[#00d4aa]/20 text-[#00d4aa]',
  C: 'bg-[#2d5a87]/20 text-[#2d5a87]',
  D: 'bg-[#6a8aaa]/20 text-[#6a8aaa]',
  new: 'bg-[#9b59b6]/20 text-[#9b59b6]',
};

const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '苏州', '西安', '重庆', '天津', '其他'];
const industries = ['互联网', '金融', '制造业', '零售', '教育', '医疗', '房地产', '传媒', '咨询', '其他'];
const channels = ['微信公众号', '微博推广', '邮件营销', '短信通知', '信息流广告', '线下推广'];

export default function Attendees() {
  const { filteredAttendees, setFilters, clearFilters } = useAttendeeStore();
  const [search, setSearch] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<CustomerLevel[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AttendeeStatus[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters({ search: value });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCities([]);
    setSelectedIndustries([]);
    setSelectedLevels([]);
    setSelectedStatuses([]);
    setSelectedChannels([]);
    setCurrentPage(1);
    clearFilters();
  };

  const toggleCityFilter = (city: string) => {
    const newSelected = selectedCities.includes(city)
      ? selectedCities.filter((v) => v !== city)
      : [...selectedCities, city];
    setSelectedCities(newSelected);
    setFilters({ cities: newSelected.length > 0 ? newSelected : undefined });
  };

  const toggleIndustryFilter = (industry: string) => {
    const newSelected = selectedIndustries.includes(industry)
      ? selectedIndustries.filter((v) => v !== industry)
      : [...selectedIndustries, industry];
    setSelectedIndustries(newSelected);
    setFilters({ industries: newSelected.length > 0 ? newSelected : undefined });
  };

  const toggleLevelFilter = (level: CustomerLevel) => {
    const newSelected = selectedLevels.includes(level)
      ? selectedLevels.filter((v) => v !== level)
      : [...selectedLevels, level];
    setSelectedLevels(newSelected);
    setFilters({ customerLevels: newSelected.length > 0 ? newSelected : undefined });
  };

  const toggleStatusFilter = (status: AttendeeStatus) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter((v) => v !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newSelected);
    setFilters({ statuses: newSelected.length > 0 ? newSelected : undefined });
  };

  const toggleChannelFilter = (channel: string) => {
    const newSelected = selectedChannels.includes(channel)
      ? selectedChannels.filter((v) => v !== channel)
      : [...selectedChannels, channel];
    setSelectedChannels(newSelected);
    setFilters({ channels: newSelected.length > 0 ? newSelected : undefined });
  };

  useEffect(() => {
    const totalPages = Math.ceil(filteredAttendees.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(Math.max(1, totalPages));
    } else if (filteredAttendees.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredAttendees.length]);

  const handleExport = () => {
    const exportData = filteredAttendees.map((a) => ({
      姓名: a.name,
      公司: a.company,
      行业: a.industry,
      城市: a.city,
      客户等级: levelLabels[a.customerLevel],
      状态: statusLabels[a.status],
      观看时长: formatDuration(a.watchDuration),
      互动次数: a.interactions,
      渠道: a.channel,
      成交金额: a.dealAmount ? formatCurrency(a.dealAmount) : '-',
    }));
    exportToCSV(exportData, '参会人明细');
  };

  const totalPages = Math.ceil(filteredAttendees.length / pageSize);
  const paginatedAttendees = filteredAttendees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = {
    total: filteredAttendees.length,
    byCity: cities.map((c) => ({ name: c, count: filteredAttendees.filter((a) => a.city === c).length })).filter((c) => c.count > 0),
    byIndustry: industries.map((i) => ({ name: i, count: filteredAttendees.filter((a) => a.industry === i).length })).filter((i) => i.count > 0),
    byLevel: Object.entries(levelLabels).map(([k, v]) => ({ name: v, count: filteredAttendees.filter((a) => a.customerLevel === k).length })),
    byStatus: Object.entries(statusLabels).map(([k, v]) => ({ name: v, count: filteredAttendees.filter((a) => a.status === k).length })),
  };

  const hasFilters = search || selectedCities.length > 0 || selectedIndustries.length > 0 || selectedLevels.length > 0 || selectedStatuses.length > 0 || selectedChannels.length > 0;

  return (
    <div className="space-y-6">
      <Header title="参会人明细" subtitle={`共 ${filteredAttendees.length} 条记录`} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#ff6b35]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">总人数</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-[#00d4aa]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">覆盖行业</p>
              <p className="text-xl font-bold text-white">{stats.byIndustry.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#2d5a87]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">覆盖城市</p>
              <p className="text-xl font-bold text-white">{stats.byCity.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-[#9b59b6]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">成交人数</p>
              <p className="text-xl font-bold text-white">{filteredAttendees.filter((a) => a.status === 'deal').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="筛选条件" action={hasFilters && <Button variant="ghost" size="sm" onClick={handleClearFilters} icon={<X className="w-4 h-4" />}>清除筛选</Button>}>
        <div className="space-y-4">
          <Input
            value={search}
            onChange={handleSearch}
            placeholder="搜索姓名或公司..."
            icon={<Search className="w-4 h-4" />}
            className="w-full md:w-64"
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-[#6a8aaa] mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 城市
              </p>
              <div className="flex flex-wrap gap-1">
                {cities.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleCityFilter(city)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs transition-colors',
                      selectedCities.includes(city) ? 'bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30' : 'bg-[#2a4a6a]/20 text-[#6a8aaa] hover:bg-[#2a4a6a]/40'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#6a8aaa] mb-2 flex items-center gap-1">
                <Building className="w-3 h-3" /> 行业
              </p>
              <div className="flex flex-wrap gap-1">
                {industries.slice(0, 6).map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleIndustryFilter(industry)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs transition-colors',
                      selectedIndustries.includes(industry) ? 'bg-[#00d4aa]/20 text-[#00d4aa] border border-[#00d4aa]/30' : 'bg-[#2a4a6a]/20 text-[#6a8aaa] hover:bg-[#2a4a6a]/40'
                    )}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#6a8aaa] mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" /> 客户等级
              </p>
              <div className="flex flex-wrap gap-1">
                {(['A', 'B', 'C', 'D', 'new'] as CustomerLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleLevelFilter(level)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs transition-colors',
                      selectedLevels.includes(level) ? levelColors[level] + ' border' : 'bg-[#2a4a6a]/20 text-[#6a8aaa] hover:bg-[#2a4a6a]/40'
                    )}
                  >
                    {levelLabels[level]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#6a8aaa] mb-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> 状态
              </p>
              <div className="flex flex-wrap gap-1">
                {(['registered', 'checked-in', 'viewed', 'interacted', 'lead', 'deal'] as AttendeeStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs transition-colors',
                      selectedStatuses.includes(status) ? statusColors[status] + ' border' : 'bg-[#2a4a6a]/20 text-[#6a8aaa] hover:bg-[#2a4a6a]/40'
                    )}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#6a8aaa] mb-2">渠道来源</p>
              <div className="flex flex-wrap gap-1">
                {channels.slice(0, 4).map((channel) => (
                  <button
                    key={channel}
                    onClick={() => toggleChannelFilter(channel)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs transition-colors',
                      selectedChannels.includes(channel) ? 'bg-[#9b59b6]/20 text-[#9b59b6] border border-[#9b59b6]/30' : 'bg-[#2a4a6a]/20 text-[#6a8aaa] hover:bg-[#2a4a6a]/40'
                    )}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="参会人列表" action={<Button variant="secondary" size="sm" onClick={handleExport} icon={<Download className="w-4 h-4" />}>导出CSV</Button>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a4a6a]/30">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">姓名</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">公司</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">行业</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">城市</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">等级</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">状态</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">观看时长</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">互动</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">渠道</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttendees.length > 0 ? (
                paginatedAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-[#2a4a6a]/20 hover:bg-[#2a4a6a]/10 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-white">{attendee.name}</td>
                    <td className="py-3 px-4 text-sm text-[#6a8aaa]">{attendee.company}</td>
                    <td className="py-3 px-4 text-sm text-[#6a8aaa]">{attendee.industry}</td>
                    <td className="py-3 px-4 text-sm text-[#6a8aaa]">{attendee.city}</td>
                    <td className="py-3 px-4">
                      <span className={cn('px-2 py-0.5 rounded-lg text-xs', levelColors[attendee.customerLevel])}>
                        {levelLabels[attendee.customerLevel]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn('px-2 py-0.5 rounded-lg text-xs', statusColors[attendee.status])}>
                        {statusLabels[attendee.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{formatDuration(attendee.watchDuration)}</td>
                    <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{attendee.interactions}</td>
                    <td className="py-3 px-4 text-sm text-[#6a8aaa]">{attendee.channel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#6a8aaa]">
                    暂无符合条件的参会人
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a4a6a]/30">
          <p className="text-sm text-[#6a8aaa]">
            {filteredAttendees.length > 0
              ? `显示 ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredAttendees.length)} 条，共 ${filteredAttendees.length} 条`
              : `共 ${filteredAttendees.length} 条`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              上一页
            </Button>
            <span className="text-sm text-white">
              {totalPages > 0 ? `${currentPage} / ${totalPages}` : '0 / 0'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              下一页
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="人群画像 - 状态分布">
          <div className="flex flex-wrap gap-2">
            {stats.byStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2a4a6a]/20">
                <span className="text-sm text-[#6a8aaa]">{s.name}</span>
                <span className="text-sm font-bold text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="人群画像 - 客户等级分布">
          <div className="flex flex-wrap gap-2">
            {stats.byLevel.map((l) => (
              <div key={l.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2a4a6a]/20">
                <span className="text-sm text-[#6a8aaa]">{l.name}</span>
                <span className="text-sm font-bold text-white">{l.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}