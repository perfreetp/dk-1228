import type { TrendData, FunnelData, DistributionData } from '@/types';

export const trendData: TrendData[] = [
  { time: '09:00', value: 120 },
  { time: '09:30', value: 280 },
  { time: '10:00', value: 520 },
  { time: '10:30', value: 680 },
  { time: '11:00', value: 750 },
  { time: '11:30', value: 820 },
  { time: '12:00', value: 580 },
  { time: '12:30', value: 420 },
  { time: '13:00', value: 350 },
  { time: '13:30', value: 480 },
  { time: '14:00', value: 720 },
  { time: '14:30', value: 850 },
  { time: '15:00', value: 920 },
  { time: '15:30', value: 880 },
  { time: '16:00', value: 760 },
  { time: '16:30', value: 620 },
  { time: '17:00', value: 450 },
];

export const funnelData: FunnelData[] = [
  { stage: '报名', count: 2150, rate: 100, dropRate: 0 },
  { stage: '签到', count: 1600, rate: 74.4, dropRate: 25.6 },
  { stage: '观看', count: 1450, rate: 90.6, dropRate: 9.4 },
  { stage: '互动', count: 890, rate: 61.4, dropRate: 38.6 },
  { stage: '留资', count: 375, rate: 42.1, dropRate: 57.9 },
  { stage: '成交', count: 102, rate: 27.2, dropRate: 72.8 },
];

export const cityDistribution: DistributionData[] = [
  { name: '北京', value: 380, percentage: 17.7 },
  { name: '上海', value: 320, percentage: 14.9 },
  { name: '广州', value: 280, percentage: 13.0 },
  { name: '深圳', value: 260, percentage: 12.1 },
  { name: '杭州', value: 220, percentage: 10.2 },
  { name: '成都', value: 180, percentage: 8.4 },
  { name: '武汉', value: 150, percentage: 7.0 },
  { name: '南京', value: 140, percentage: 6.5 },
  { name: '其他', value: 220, percentage: 10.2 },
];

export const industryDistribution: DistributionData[] = [
  { name: '互联网', value: 520, percentage: 24.2 },
  { name: '金融', value: 380, percentage: 17.7 },
  { name: '制造业', value: 320, percentage: 14.9 },
  { name: '零售', value: 280, percentage: 13.0 },
  { name: '教育', value: 220, percentage: 10.2 },
  { name: '医疗', value: 180, percentage: 8.4 },
  { name: '其他', value: 250, percentage: 11.6 },
];

export const customerLevelDistribution: DistributionData[] = [
  { name: 'A级客户', value: 180, percentage: 8.4 },
  { name: 'B级客户', value: 350, percentage: 16.3 },
  { name: 'C级客户', value: 480, percentage: 22.3 },
  { name: 'D级客户', value: 620, percentage: 28.8 },
  { name: '新客户', value: 520, percentage: 24.2 },
];

export const hourlyTrend: TrendData[] = [
  { time: '00:00', value: 15 },
  { time: '02:00', value: 8 },
  { time: '04:00', value: 5 },
  { time: '06:00', value: 12 },
  { time: '08:00', value: 85 },
  { time: '10:00', value: 320 },
  { time: '12:00', value: 180 },
  { time: '14:00', value: 280 },
  { time: '16:00', value: 350 },
  { time: '18:00', value: 420 },
  { time: '20:00', value: 380 },
  { time: '22:00', value: 120 },
];