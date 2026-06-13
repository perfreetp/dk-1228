import Header from '@/components/layout/Header';
import Card from '@/components/common/Card';
import FunnelChart from '@/components/charts/FunnelChart';
import { useActivityStore } from '@/store/activityStore';
import { funnelData } from '@/data/charts';
import { formatPercent, formatNumber } from '@/utils/format';
import { AlertTriangle, CheckCircle, Lightbulb, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Funnel() {
  const { currentActivity } = useActivityStore();

  if (!currentActivity) return null;

  const metrics = currentActivity.metrics;

  const highDropStages = funnelData.filter((d) => d.dropRate > 30);
  const highConversionStages = funnelData.filter((d, i) => i > 0 && d.rate > 60);

  const insights = [
    {
      type: 'warning',
      title: '签到环节流失较高',
      description: '25.6%的报名用户未能完成签到，建议优化签到流程提醒',
      icon: AlertTriangle,
    },
    {
      type: 'warning',
      title: '留资环节转化偏低',
      description: '57.9%的互动用户未提交留资信息，需优化留资引导',
      icon: AlertTriangle,
    },
    {
      type: 'success',
      title: '观看环节转化良好',
      description: '90.6%的签到用户完成了观看，内容吸引力较强',
      icon: CheckCircle,
    },
    {
      type: 'success',
      title: '成交转化超出预期',
      description: '27.2%的留资用户完成成交，销售跟进效果显著',
      icon: CheckCircle,
    },
  ];

  const recommendations = [
    '增加签到前的短信/微信提醒频次',
    '在互动环节增加留资引导弹窗',
    '优化留资表单，减少填写字段',
    '设置成交激励，如限时优惠',
    '加强销售团队跟进培训',
  ];

  return (
    <div className="space-y-6">
      <Header title="转化漏斗" subtitle="报名→签到→观看→互动→留资→成交" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6a8aaa]">整体转化率</span>
            <span className="text-2xl font-bold text-[#00d4aa]">{formatPercent(funnelData[funnelData.length - 1].rate)}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#6a8aaa]">
            <ArrowDownRight className="w-3 h-3" />
            从报名到成交的完整路径
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6a8aaa]">最高流失环节</span>
            <span className="text-2xl font-bold text-[#ff4757]">{formatPercent(Math.max(...funnelData.map((d) => d.dropRate)))}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#6a8aaa]">
            <AlertTriangle className="w-3 h-3 text-[#ff4757]" />
            留资环节流失最严重
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6a8aaa]">最高转化环节</span>
            <span className="text-2xl font-bold text-[#00d4aa]">{formatPercent(Math.max(...funnelData.slice(1).map((d) => d.rate)))}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#6a8aaa]">
            <ArrowUpRight className="w-3 h-3 text-[#00d4aa]" />
            签到→观看转化最佳
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6a8aaa]">平均客单价</span>
            <span className="text-2xl font-bold text-white">{formatNumber(metrics.dealAmount / metrics.deals)}元</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#6a8aaa]">
            <CheckCircle className="w-3 h-3 text-[#00d4aa]" />
            成交质量良好
          </div>
        </Card>
      </div>

      <FunnelChart data={funnelData} title="转化漏斗分析" height={400} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="流失节点分析" subtitle="识别高流失环节">
          <div className="space-y-3">
            {highDropStages.map((stage) => (
              <div key={stage.stage} className="p-4 rounded-xl bg-gradient-to-r from-[#ff4757]/20 to-[#ff6b6b]/10 border border-[#ff4757]/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#ff4757]" />
                    <span className="text-sm font-medium text-white">{stage.stage}</span>
                  </div>
                  <span className="text-lg font-bold text-[#ff4757]">{formatPercent(stage.dropRate)}</span>
                </div>
                <p className="text-xs text-[#6a8aaa]">
                  流失 {formatNumber(stage.count - funnelData[funnelData.indexOf(stage) + 1]?.count || 0)} 人
                </p>
                <div className="mt-2 h-1.5 bg-[#2a4a6a]/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff4757] rounded-full" style={{ width: `${stage.dropRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="高转化环节" subtitle="识别表现优秀的环节">
          <div className="space-y-3">
            {highConversionStages.map((stage) => (
              <div key={stage.stage} className="p-4 rounded-xl bg-gradient-to-r from-[#00d4aa]/20 to-[#00b894]/10 border border-[#00d4aa]/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00d4aa]" />
                    <span className="text-sm font-medium text-white">{stage.stage}</span>
                  </div>
                  <span className="text-lg font-bold text-[#00d4aa]">{formatPercent(stage.rate)}</span>
                </div>
                <p className="text-xs text-[#6a8aaa]">
                  上一环节转化 {formatNumber(stage.count)} 人
                </p>
                <div className="mt-2 h-1.5 bg-[#2a4a6a]/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00d4aa] rounded-full" style={{ width: `${stage.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="洞察与建议" subtitle="基于数据分析的优化建议">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={cn(
                'p-4 rounded-xl border',
                insight.type === 'warning'
                  ? 'bg-gradient-to-r from-[#ff4757]/10 to-transparent border-[#ff4757]/20'
                  : 'bg-gradient-to-r from-[#00d4aa]/10 to-transparent border-[#00d4aa]/20'
              )}
            >
              <div className="flex items-start gap-3">
                <insight.icon className={cn('w-5 h-5', insight.type === 'warning' ? 'text-[#ff4757]' : 'text-[#00d4aa]')} />
                <div>
                  <p className="text-sm font-medium text-white">{insight.title}</p>
                  <p className="text-xs text-[#6a8aaa] mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#2a4a6a]/20 border border-[#2a4a6a]/30">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#ff6b35]" />
            <span className="text-sm font-medium text-white">优化建议</span>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#6a8aaa]">
                <span className="w-5 h-5 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-xs text-[#ff6b35] font-medium">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}