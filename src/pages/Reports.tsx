import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useReportStore } from '@/store/reportStore';
import { useActivityStore } from '@/store/activityStore';
import { feedbackKeywords, feedbackStats } from '@/data/attendees';
import { generateShareLink, copyToClipboard } from '@/utils/export';
import { formatPercent } from '@/utils/format';
import { FileText, Plus, Share2, Copy, Trash2, Edit3, Star, MessageCircle, Calendar, User, Link, Check, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ReportNote } from '@/types';

export default function Reports() {
  const { reports, currentReport, setCurrentReport, createReport, addNote, deleteNote, shareReport } = useReportStore();
  const { currentActivity } = useActivityStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateReport = () => {
    if (currentActivity && newReportTitle) {
      createReport(currentActivity.id, newReportTitle);
      setShowCreateModal(false);
      setNewReportTitle('');
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
      shareReport(currentReport.id, {
        enabled: true,
        link: generateShareLink(currentReport.id),
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
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
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
                  <p className="text-sm font-medium text-white truncate">{report.title}</p>
                  {report.shareSettings?.enabled && (
                    <Share2 className="w-4 h-4 text-[#00d4aa]" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6a8aaa]">
                  <Calendar className="w-3 h-3" />
                  {report.createdAt}
                  <User className="w-3 h-3 ml-2" />
                  {report.createdBy}
                </div>
                <div className="mt-2 text-xs text-[#6a8aaa]">
                  {report.notes.length} 条备注 · {report.sections.length} 个章节
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="报告详情" className="lg:col-span-2">
          {currentReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentReport.title}</h3>
                  <p className="text-sm text-[#6a8aaa] mt-1">
                    创建于 {currentReport.createdAt} · {currentReport.createdBy}
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
                <div className="p-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center gap-2">
                  <Link className="w-4 h-4 text-[#00d4aa]" />
                  <span className="text-sm text-[#6a8aaa]">分享链接：</span>
                  <span className="text-sm text-[#00d4aa] truncate">{currentReport.shareSettings.link}</span>
                  {currentReport.shareSettings.expiresAt && (
                    <span className="text-xs text-[#6a8aaa] ml-2">有效期至 {currentReport.shareSettings.expiresAt}</span>
                  )}
                </div>
              )}

              <div className="border-t border-[#2a4a6a]/30 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white">复盘备注</p>
                  <Button variant="ghost" size="sm" onClick={handleAddNote} disabled={!newNoteContent} icon={<Edit3 className="w-4 h-4" />}>
                    添加备注
                  </Button>
                </div>
                <Input
                  value={newNoteContent}
                  onChange={setNewNoteContent}
                  placeholder="输入复盘备注..."
                  className="mb-3"
                />
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
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
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-[#6a8aaa]">
              <Eye className="w-8 h-8 mb-2" />
              <p>选择一个报告查看详情</p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="问卷反馈汇总" subtitle={`${feedbackStats.total} 条有效反馈`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2a4a6a]/20">
              <span className="text-sm text-[#6a8aaa]">平均评分</span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-2xl font-bold text-white">{feedbackStats.averageRating}</span>
              </div>
            </div>

            <div className="flex items-end gap-2 h-32">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = feedbackStats.ratingDistribution[rating as keyof typeof feedbackStats.ratingDistribution];
                const maxCount = Math.max(...Object.values(feedbackStats.ratingDistribution));
                return (
                  <div key={rating} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-[#ff6b35] to-[#ff8c5a] rounded-t-lg"
                      style={{ height: `${(count / maxCount) * 100}%` }}
                    />
                    <span className="text-xs text-[#6a8aaa] mt-2">{rating}星</span>
                    <span className="text-xs text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card title="关键词云" subtitle="用户反馈高频关键词">
          <div className="flex flex-wrap gap-2">
            {feedbackKeywords.map((kw) => {
              const maxCount = Math.max(...feedbackKeywords.map((k) => k.count));
              const size = 12 + (kw.count / maxCount) * 8;
              const opacity = 0.5 + (kw.count / maxCount) * 0.5;
              return (
                <span
                  key={kw.keyword}
                  className="px-3 py-1.5 rounded-xl bg-[#2a4a6a]/20 text-white transition-all hover:bg-[#ff6b35]/20 hover:text-[#ff6b35]"
                  style={{ fontSize: `${size}px`, opacity }}
                >
                  {kw.keyword}
                </span>
              );
            })}
          </div>
        </Card>
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