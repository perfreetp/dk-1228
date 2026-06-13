import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import MetricCard from '@/components/common/MetricCard';
import FunnelChart from '@/components/charts/FunnelChart';
import BarChart from '@/components/charts/BarChart';
import { useReportStore } from '@/store/reportStore';
import { useActivityStore } from '@/store/activityStore';
import { feedbackKeywords, feedbackStats } from '@/data/attendees';
import { funnelData } from '@/data/charts';
import { generateShareLink, copyToClipboard } from '@/utils/export';
import { formatCurrency, formatPercent, calculateROI, calculateConversionRate } from '@/utils/format';
import { FileText, Plus, Share2, Copy, Trash2, Edit3, Star, MessageCircle, Calendar, User, Link, Check, X, Eye, Settings, Users, CheckCircle, Eye as EyeIcon, MessageSquare, FileCheck, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { ReportNote, ReportSection, ReportSectionType } from '@/types';

const defaultSections: ReportSection[] = [
  { type: 'metrics', title: '核心指标概览', enabled: true },
  { type: 'channel', title: '渠道效果对比', enabled: true },
  { type: 'funnel', title: '转化漏斗分析', enabled: true },
  { type: 'survey', title: '问卷反馈汇总', enabled: true },
  { type: 'notes', title: '复盘备注', enabled: true },
];

const sectionIcons: Record<ReportSectionType, React.ReactNode> = {
  metrics: <Users className="w-4 h-4" />,
  channel: <BarChart2 className="w-4 h-4" />,
  funnel: <FileCheck className="w-4 h-4" />,
  survey: <MessageSquare className="w-4 h-4" />,
  notes: <Edit3 className="w-4 h-4" />,
};

const channelColors: Record<string, string> = {
  wechat: '#ff6b35',
  weibo: '#00d4aa',
  email: '#2d5a87',
  sms: '#9b59b6',
  ads: '#f39c12',
  offline: '#1abc9c',
  other: '#e74c3c',
};

export default function Reports() {
  const { reports, currentReport, setCurrentReport, createReport, addNote, deleteNote, shareReport } = useReportStore();
  const { currentActivity } = useActivityStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [selectedSections, setSelectedSections] = useState<ReportSection[]>(defaultSections);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSectionToggle = (type: ReportSectionType) => {
    setSelectedSections((prev) =>
      prev.map((s) => (s.type === type ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleCreateReport = () => {
    if (currentActivity && newReportTitle) {
      createReport(currentActivity.id, newReportTitle, selectedSections);
      setShowCreateModal(false);
      setNewReportTitle('');
      setSelectedSections(defaultSections);
    }
  };

  const handleAddNote = () => {
    if (currentReport && newNoteContent) {
      const note: ReportNote = {
        id: `n${Date.now()}`,
        content: newNoteContent,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: '当前用户',
      };
      addNote(currentReport.id, note);
      setNewNoteContent('');
    }
  };

  const handleShare = (expiresIn?: number) => {
    if (currentReport) {
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined;
      const shareLink = generateShareLink(currentReport.id);
      shareReport(currentReport.id, {
        enabled: true,
        link: shareLink,
        expiresAt,
        permissions: ['view', 'export'],
      });
      setShowShareModal(false);
    }
  };

  const handleCopyLink = async () => {
    if (currentReport?.shareSettings?.link) {
      await copyToClipboard(currentReport.shareSettings.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activity = currentActivity;
  const metrics = activity?.metrics;
  const target = activity?.target;
  const roi = metrics && activity ? calculateROI(metrics.dealAmount, activity.budget) : 0;

  return (
    <div className="space-y-6">
      <Header title="报告中心" subtitle="生成复盘报告并分享给团队" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#ff6b35]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">已生成报告</p>
              <p className="text-xl font-bold text-white">{reports.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-[#00d4aa]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">已分享报告</p>
              <p className="text-xl font-bold text-white">{reports.filter((r) => r.shareSettings?.enabled).length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-[#2d5a87]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">复盘备注</p>
              <p className="text-xl font-bold text-white">{reports.reduce((s, r) => s + r.notes.length, 0)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-[#9b59b6]" />
            <div>
              <p className="text-xs text-[#6a8aaa]">问卷平均评分</p>
              <p className="text-xl font-bold text-white">{feedbackStats.averageRating}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="报告列表" className="lg:col-span-1" action={<Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)} icon={<Plus className="w-4 h-4" />}>新建报告</Button>}>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setCurrentReport(report.id)}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all border',
                  currentReport?.id === report.id
                    ? 'bg-gradient-to-r from-[#ff6b35]/20 to-[#ff6b35]/5 border-[#ff6b35]/30'
                    : 'bg-[#2a4a6a]/20 border-[#2a4a6a]/30 hover:bg-[#2a4a6a]/40'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-white truncate pr-2">{report.title}</p>
                  {report.shareSettings?.enabled && (
                    <Share2 className="w-4 h-4 text-[#00d4aa] flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6a8aaa]">
                  <Calendar className="w-3 h-3" />
                  {report.createdAt}
                  <User className="w-3 h-3 ml-2" />
                  {report.createdBy}
                </div>
                <div className="mt-2 flex items-center gap-1 flex-wrap">
                  {report.sections.filter((s) => s.enabled).map((s) => (
                    <span key={s.type} className="px-1.5 py-0.5 rounded text-xs bg-[#2a4a6a]/30 text-[#6a8aaa]">
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {currentReport && activity ? (
            <>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentReport.title}</h3>
                    <p className="text-sm text-[#6a8aaa] mt-1">
                      {currentReport.createdAt} · {currentReport.createdBy} · {activity.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowShareModal(true)} icon={<Share2 className="w-4 h-4" />}>
                      分享
                    </Button>
                    {currentReport.shareSettings?.enabled && (
                      <Button variant="ghost" size="sm" onClick={handleCopyLink} icon={copied ? <Check className="w-4 h-4 text-[#00d4aa]" /> : <Copy className="w-4 h-4" />}>
                        {copied ? '已复制' : '复制链接'}
                      </Button>
                    )}
                  </div>
                </div>

                {currentReport.shareSettings?.enabled && (
                  <div className="p-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center gap-2 mb-4">
                    <Link className="w-4 h-4 text-[#00d4aa]" />
                    <span className="text-sm text-[#6a8aaa]">分享链接：</span>
                    <span className="text-sm text-[#00d4aa] truncate flex-1">{currentReport.shareSettings.link}</span>
                    {currentReport.shareSettings.expiresAt && (
                      <span className="text-xs text-[#6a8aaa]">有效期至 {currentReport.shareSettings.expiresAt}</span>
                    )}
                  </div>
                )}
              </Card>

              {currentReport.sections.find((s) => s.type === 'metrics' && s.enabled) && (
                <Card>
                  <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#ff6b35]" />
                    核心指标概览
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <MetricCard title="报名" value={metrics.registrations} target={target.registrations} icon={<Users className="w-4 h-4" />} color="orange" />
                    <MetricCard title="签到" value={metrics.checkIns} icon={<CheckCircle className="w-4 h-4" />} color="green" />
                    <MetricCard title="观看" value={metrics.viewers} icon={<EyeIcon className="w-4 h-4" />} color="blue" />
                    <MetricCard title="互动" value={metrics.interactions} icon={<MessageSquare className="w-4 h-4" />} color="purple" />
                    <MetricCard title="留资" value={metrics.leads} target={target.leads} icon={<FileCheck className="w-4 h-4" />} color="orange" />
                    <MetricCard title="成交" value={metrics.deals} target={target.deals} icon={<ShoppingCart className="w-4 h-4" />} color="green" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-lg bg-[#2a4a6a]/20">
                      <p className="text-xs text-[#6a8aaa]">ROI</p>
                      <p className="text-xl font-bold text-[#00d4aa]">{roi.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#2a4a6a]/20">
                      <p className="text-xs text-[#6a8aaa]">总预算</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(activity.budget)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#2a4a6a]/20">
                      <p className="text-xs text-[#6a8aaa]">成交金额</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(metrics.dealAmount)}</p>
                    </div>
                  </div>
                </Card>
              )}

              {currentReport.sections.find((s) => s.type === 'channel' && s.enabled) && (
                <Card>
                  <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#00d4aa]" />
                    渠道效果对比
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#2a4a6a]/30">
                          <th className="text-left py-2 px-3 text-xs text-[#6a8aaa]">渠道</th>
                          <th className="text-right py-2 px-3 text-xs text-[#6a8aaa]">成本</th>
                          <th className="text-right py-2 px-3 text-xs text-[#6a8aaa]">报名</th>
                          <th className="text-right py-2 px-3 text-xs text-[#6a8aaa]">留资</th>
                          <th className="text-right py-2 px-3 text-xs text-[#6a8aaa]">成交</th>
                          <th className="text-right py-2 px-3 text-xs text-[#6a8aaa]">转化率</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activity.channels.slice(0, 6).map((c) => {
                          const rate = calculateConversionRate(c.registrations, c.deals);
                          return (
                            <tr key={c.id} className="border-b border-[#2a4a6a]/20">
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channelColors[c.type] }} />
                                  <span className="text-sm text-white">{c.name}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-right text-sm text-white">{formatCurrency(c.cost)}</td>
                              <td className="py-2 px-3 text-right text-sm text-white">{c.registrations}</td>
                              <td className="py-2 px-3 text-right text-sm text-white">{c.leads}</td>
                              <td className="py-2 px-3 text-right text-sm text-white">{c.deals}</td>
                              <td className="py-2 px-3 text-right text-sm text-[#00d4aa]">{formatPercent(rate)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {currentReport.sections.find((s) => s.type === 'funnel' && s.enabled) && (
                <FunnelChart data={funnelData} title="转化漏斗分析" height={300} />
              )}

              {currentReport.sections.find((s) => s.type === 'survey' && s.enabled) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#ff6b35]" />
                      问卷反馈 ({feedbackStats.total}条)
                    </h4>
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-8 h-8 text-[#ff6b35]" />
                        <span className="text-4xl font-bold text-white">{feedbackStats.averageRating}</span>
                      </div>
                      <p className="text-xs text-[#6a8aaa] mt-1">平均评分</p>
                    </div>
                    <div className="flex items-end gap-1 h-20">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = feedbackStats.ratingDistribution[rating as keyof typeof feedbackStats.ratingDistribution];
                        const maxCount = Math.max(...Object.values(feedbackStats.ratingDistribution));
                        return (
                          <div key={rating} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-[#ff6b35] rounded-t" style={{ height: `${(count / maxCount) * 100}%` }} />
                            <span className="text-xs text-[#6a8aaa] mt-1">{rating}星</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                  <Card>
                    <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#9b59b6]" />
                      关键词云
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {feedbackKeywords.map((kw) => {
                        const maxCount = Math.max(...feedbackKeywords.map((k) => k.count));
                        const size = 12 + (kw.count / maxCount) * 8;
                        return (
                          <span
                            key={kw.keyword}
                            className="px-3 py-1.5 rounded-xl bg-[#2a4a6a]/20 text-white"
                            style={{ fontSize: `${size}px` }}
                          >
                            {kw.keyword}
                          </span>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              )}

              {currentReport.sections.find((s) => s.type === 'notes' && s.enabled) && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#ff6b35]" />
                      复盘备注
                    </h4>
                    <Button variant="ghost" size="sm" onClick={handleAddNote} disabled={!newNoteContent} icon={<Edit3 className="w-4 h-4" />}>
                      添加备注
                    </Button>
                  </div>
                  <Input
                    value={newNoteContent}
                    onChange={setNewNoteContent}
                    placeholder="输入复盘备注..."
                    className="mb-4"
                  />
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {currentReport.notes.map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30 group">
                        <p className="text-sm text-white">{note.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-[#6a8aaa]">{note.createdAt} · {note.createdBy}</p>
                          <button
                            onClick={() => deleteNote(currentReport.id, note.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#ff4757]/20"
                          >
                            <Trash2 className="w-3 h-3 text-[#ff4757]" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {currentReport.notes.length === 0 && (
                      <p className="text-sm text-[#6a8aaa] text-center py-4">暂无备注</p>
                    )}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center h-64 text-[#6a8aaa]">
                <Eye className="w-8 h-8 mb-2" />
                <p>选择一个报告查看详情</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a2d4a] rounded-2xl border border-[#2a4a6a]/50 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">新建报告</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-[#2a4a6a]/30 text-[#6a8aaa]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Input
              value={newReportTitle}
              onChange={setNewReportTitle}
              placeholder="输入报告标题..."
              className="mb-4"
            />
            <div className="mb-4">
              <p className="text-sm text-[#6a8aaa] mb-2">选择报告模块：</p>
              <div className="space-y-2">
                {selectedSections.map((section) => (
                  <label
                    key={section.type}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30 cursor-pointer hover:bg-[#2a4a6a]/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={() => handleSectionToggle(section.type)}
                      className="w-4 h-4 rounded accent-[#ff6b35]"
                    />
                    <span className="text-[#6a8aaa]">{sectionIcons[section.type]}</span>
                    <span className="text-sm text-white">{section.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>取消</Button>
              <Button variant="primary" onClick={handleCreateReport} disabled={!newReportTitle}>创建</Button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && currentReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a2d4a] rounded-2xl border border-[#2a4a6a]/50 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">分享报告</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 rounded-lg hover:bg-[#2a4a6a]/30 text-[#6a8aaa]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#6a8aaa] mb-4">选择分享有效期：</p>
            <div className="space-y-2 mb-4">
              <Button variant="secondary" className="w-full justify-start" onClick={() => handleShare(7)}>
                7天有效期
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => handleShare(30)}>
                30天有效期
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => handleShare()}>
                永久有效
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setShowShareModal(false)}>
              取消
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}