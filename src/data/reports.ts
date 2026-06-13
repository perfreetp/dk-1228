import type { Report } from '@/types';

export const reports: Report[] = [
  {
    id: 'r1',
    activityId: 'a1',
    title: '2026春季新品发布会复盘报告',
    createdAt: '2026-03-16',
    createdBy: '张明',
    sections: [
      { type: 'metrics', title: '核心指标概览', data: {} },
      { type: 'chart', title: '转化漏斗分析', data: {} },
      { type: 'chart', title: '渠道效果对比', data: {} },
      { type: 'table', title: '参会人明细', data: {} },
    ],
    notes: [
      { id: 'n1', content: '本次发布会整体效果超出预期，报名人数超额完成7.5%', createdAt: '2026-03-16', createdBy: '张明' },
      { id: 'n2', content: '信息流广告渠道ROI最高，建议下次加大投入', createdAt: '2026-03-16', createdBy: '李芳' },
      { id: 'n3', content: '签到环节流失率偏高，需优化签到流程', createdAt: '2026-03-17', createdBy: '王伟' },
    ],
    shareSettings: {
      enabled: true,
      link: 'https://analytics.example.com/share/r1',
      permissions: ['view', 'export'],
    },
  },
  {
    id: 'r2',
    activityId: 'a2',
    title: '2026数字营销峰会复盘报告',
    createdAt: '2026-04-23',
    createdBy: '李芳',
    sections: [
      { type: 'metrics', title: '核心指标概览', data: {} },
      { type: 'chart', title: '转化漏斗分析', data: {} },
    ],
    notes: [
      { id: 'n4', content: '峰会三天参与度稳定，第二天互动最活跃', createdAt: '2026-04-23', createdBy: '李芳' },
    ],
  },
  {
    id: 'r3',
    activityId: 'a3',
    title: '产品直播培训复盘报告',
    createdAt: '2026-05-11',
    createdBy: '王伟',
    sections: [
      { type: 'metrics', title: '核心指标概览', data: {} },
      { type: 'chart', title: '观看时长分布', data: {} },
    ],
    notes: [
      { id: 'n5', content: '直播观看时长平均45分钟，用户粘性良好', createdAt: '2026-05-11', createdBy: '王伟' },
    ],
  },
];