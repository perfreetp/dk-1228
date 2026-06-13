import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReportStore } from '@/store/reportStore';
import { useActivityStore } from '@/store/activityStore';
import MetricCard from '@/components/common/MetricCard';
import Card from '@/components/common/Card';
import FunnelChart from '@/components/charts/FunnelChart';
import BarChart from '@/components/charts/BarChart';
import { funnelData } from '@/data/charts';
import { feedbackKeywords, feedbackStats } from '@/data/attendees';
import { formatCurrency, formatPercent, calculateROI, calculateConversionRate } from '@/utils/format';
import { AlertTriangle, Users, CheckCircle, Eye, MessageCircle, FileText, ShoppingCart, Calendar, ArrowLeft, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Report } from '@/types';

const channelColors: Record<string, string> = {
  wechat: '#ff6b35',
  weibo: '#00d4aa',
  email: '#2d5a87',
  sms: '#9b59b6',
  ads: '#f39c12',
  offline: '#1abc9c',
  other: '#e74c3c',
};

export default function SharedReport() {
  const { link } = useParams<{ link: string }>();
  const { getReportByShareLink } = useReportStore();
  const { activities } = useActivityStore();
  const [report, setReport] = useState<Report | null>(null);
  const [expired, setExpired] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (link) {
      const decodedLink = decodeURIComponent(link);
      const foundReport = getReportByShareLink(decodedLink);
      
      if (!foundReport) {
        const allReports = useReportStore.getState().reports;
        const reportById = allReports.find((r) => r.id === link || r.shareSettings?.link === decodedLink);
        
        if (reportById?.shareSettings?.expiresAt) {
          const today = new Date().toISOString().split('T')[0];
          if (reportById.shareSettings.expiresAt < today) {
            setExpired(true);
          }
        } else if (!reportById) {
          setNotFound(true);
        }
        setReport(reportById || null);
      } else {
        setReport(foundReport);
      }
    }
  }, [link, getReportByShareLink]);

  if (expired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1a2d] via-[#1a2d4a] to-[#0f1a2d] flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-[#ff4757]/20">
              <Clock className="w-12 h-12 text-[#ff4757]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">链接已过期</h1>
          <p className="text-[#6a8aaa] mb-6">
            此报告分享链接已超过有效期，请联系报告创建者获取新的分享链接。
          </p>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white font-medium hover:scale-[1.02] transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            返回报告中心
          </Link>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1a2d] via-[#1a2d4a] to-[#0f1a2d] flex items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-[#ff4757]/20">
              <AlertTriangle className="w-12 h-12 text-[#ff4757]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">报告未找到</h1>
          <p className="text-[#6a8aaa] mb-6">
            此报告不存在或已被删除。
          </p>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white font-medium hover:scale-[1.02] transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            返回报告中心
          </Link>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1a2d] via-[#1a2d4a] to-[#0f1a2d] flex items-center justify-center">
        <div className="animate-pulse text-[#6a8aaa]">加载中...</div>
      </div>
    );
  }

  const activity = activities.find((a) => a.id === report.activityId) || activities[0];
  const metrics = activity.metrics;
  const target = activity.target;
  const roi = calculateROI(metrics.dealAmount, activity.budget);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1a2d] via-[#1a2d4a] to-[#0f1a2d]">
      <header className="sticky top-0 z-50 bg-[#0f1a2d]/90 backdrop-blur-xl border-b border-[#2a4a6a]/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">活动效果分析平台</h1>
              <p className="text-xs text-[#6a8aaa]">分享报告</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#00d4aa] bg-[#00d4aa]/10 px-3 py-1.5 rounded-lg">
            <Eye className="w-4 h-4" />
            <span className="text-sm">只读模式</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{report.title}</h2>
              <div className="flex items-center gap-4 text-sm text-[#6a8aaa]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {report.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {report.createdBy}
                </span>
              </div>
            </div>
            {report.shareSettings?.expiresAt && (
              <div className="flex items-center gap-1 text-xs text-[#6a8aaa] bg-[#2a4a6a]/20 px-3 py-1.5 rounded-lg">
                <Clock className="w-3 h-3" />
                有效期至 {report.shareSettings.expiresAt}
              </div>
            )}
          </div>
          <div className="p-4 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30">
            <p className="text-sm text-[#6a8aaa]">
              活动：<span className="text-white font-medium">{activity.name}</span>
              {' · '}
              <span>{activity.startDate}</span>
            </p>
          </div>
        </Card>

        {report.sections.find((s) => s.type === 'metrics' && s.enabled) && (
          <>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00d4aa]" />
              核心指标概览
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="报名人数"
                value={metrics.registrations}
                target={target.registrations}
                icon={<Users className="w-5 h-5 text-[#ff6b35]" />}
                color="orange"
              />
              <MetricCard
                title="签到人数"
                value={metrics.checkIns}
                target={target.checkIns}
                icon={<CheckCircle className="w-5 h-5 text-[#00d4aa]" />}
                color="green"
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
              />
              <MetricCard
                title="留资人数"
                value={metrics.leads}
                target={target.leads}
                icon={<FileText className="w-5 h-5 text-[#ff6b35]" />}
                color="orange"
              />
              <MetricCard
                title="成交人数"
                value={metrics.deals}
                target={target.deals}
                icon={<ShoppingCart className="w-5 h-5 text-[#00d4aa]" />}
                color="green"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-xs text-[#6a8aaa] mb-2">投资回报率 (ROI)</p>
                <p className="text-3xl font-bold text-[#00d4aa]">{roi.toFixed(1)}%</p>
                <p className="text-xs text-[#6a8aaa] mt-1">
                  成交 {formatCurrency(metrics.dealAmount)} / 预算 {formatCurrency(activity.budget)}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-[#6a8aaa] mb-2">总投入成本</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(activity.budget)}</p>
                <p className="text-xs text-[#6a8aaa] mt-1">渠道数量 {activity.channels.length} 个</p>
              </Card>
              <Card>
                <p className="text-xs text-[#6a8aaa] mb-2">成交金额</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(metrics.dealAmount)}</p>
                <p className="text-xs text-[#6a8aaa] mt-1">平均客单价 {formatCurrency(metrics.dealAmount / metrics.deals)}</p>
              </Card>
            </div>
          </>
        )}

        {report.sections.find((s) => s.type === 'channel' && s.enabled) && (
          <>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00d4aa]" />
              渠道效果对比
            </h3>
            <Card title="渠道数据详情">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a4a6a]/30">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#6a8aaa]">渠道名称</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">投入成本</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">报名数</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">留资数</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">成交数</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[#6a8aaa]">转化率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.channels.map((channel) => {
                      const convRate = calculateConversionRate(channel.registrations, channel.deals);
                      return (
                        <tr key={channel.id} className="border-b border-[#2a4a6a]/20">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channelColors[channel.type] }} />
                              <span className="text-sm font-medium text-white">{channel.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{formatCurrency(channel.cost)}</td>
                          <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.registrations.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.leads.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-sm text-white tabular-nums">{channel.deals.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={cn('text-sm font-medium tabular-nums', convRate > 10 ? 'text-[#00d4aa]' : 'text-[#ff6b35]')}>
                              {formatPercent(convRate)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
            <BarChart
              data={activity.channels.map((c) => ({
                name: c.name,
                value: c.registrations,
                color: channelColors[c.type],
              }))}
              height={280}
            />
          </>
        )}

        {report.sections.find((s) => s.type === 'funnel' && s.enabled) && (
          <>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00d4aa]" />
              转化漏斗分析
            </h3>
            <FunnelChart data={funnelData} height={350} />
          </>
        )}

        {report.sections.find((s) => s.type === 'survey' && s.enabled) && (
          <>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00d4aa]" />
              问卷反馈汇总
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title={`${feedbackStats.total} 条有效反馈`}>
                <div className="flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <StarIcon className="w-8 h-8 text-[#ff6b35]" />
                      <span className="text-5xl font-bold text-white">{feedbackStats.averageRating}</span>
                    </div>
                    <p className="text-sm text-[#6a8aaa]">平均评分</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 h-24 mt-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = feedbackStats.ratingDistribution[rating as keyof typeof feedbackStats.ratingDistribution];
                    const maxCount = Math.max(...Object.values(feedbackStats.ratingDistribution));
                    return (
                      <div key={rating} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-[#ff6b35] to-[#ff8c5a] rounded-t-lg transition-all"
                          style={{ height: `${(count / maxCount) * 100}%` }}
                        />
                        <span className="text-xs text-[#6a8aaa] mt-2">{rating}星</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
              <Card title="关键词云">
                <div className="flex flex-wrap gap-2">
                  {feedbackKeywords.map((kw) => {
                    const maxCount = Math.max(...feedbackKeywords.map((k) => k.count));
                    const size = 12 + (kw.count / maxCount) * 10;
                    const opacity = 0.5 + (kw.count / maxCount) * 0.5;
                    return (
                      <span
                        key={kw.keyword}
                        className="px-3 py-1.5 rounded-xl bg-[#2a4a6a]/20 text-white transition-all"
                        style={{ fontSize: `${size}px`, opacity }}
                      >
                        {kw.keyword}
                      </span>
                    );
                  })}
                </div>
              </Card>
            </div>
          </>
        )}

        {report.sections.find((s) => s.type === 'notes' && s.enabled) && (
          <>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00d4aa]" />
              复盘备注
            </h3>
            <Card>
              {report.notes.length > 0 ? (
                <div className="space-y-3">
                  {report.notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30">
                      <p className="text-sm text-white">{note.content}</p>
                      <p className="text-xs text-[#6a8aaa] mt-2">{note.createdAt} · {note.createdBy}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6a8aaa] text-center py-8">暂无复盘备注</p>
              )}
            </Card>
          </>
        )}
      </main>

      <footer className="border-t border-[#2a4a6a]/30 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-[#6a8aaa]">
          <p>活动效果分析平台 · 报告分享</p>
        </div>
      </footer>
    </div>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}