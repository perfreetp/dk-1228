import type { Attendee, Feedback } from '@/types';

const industries = ['互联网', '金融', '制造业', '零售', '教育', '医疗', '房地产', '传媒', '咨询', '其他'];
const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '苏州', '西安', '重庆', '天津'];
const customerLevels: Array<'A' | 'B' | 'C' | 'D' | 'new'> = ['A', 'B', 'C', 'D', 'new'];
const statuses: Array<'registered' | 'checked-in' | 'viewed' | 'interacted' | 'lead' | 'deal'> = ['registered', 'checked-in', 'viewed', 'interacted', 'lead', 'deal'];
const channels = ['微信公众号', '微博推广', '邮件营销', '短信通知', '信息流广告', '线下推广'];

const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞'];
const companyPrefixes = ['华', '中', '新', '大', '金', '盛', '博', '创', '智', '联', '云', '数', '科', '网', '信'];
const companySuffixes = ['科技', '网络', '信息', '数据', '智能', '软件', '互联网', '集团', '有限公司', '股份有限公司'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName(): string {
  return randomItem(firstNames) + randomItem(lastNames) + (Math.random() > 0.5 ? randomItem(lastNames) : '');
}

function generateCompany(): string {
  return randomItem(companyPrefixes) + randomItem(companyPrefixes) + randomItem(companySuffixes);
}

function generateFeedback(): Feedback | undefined {
  if (Math.random() > 0.6) return undefined;
  
  const keywords = ['内容丰富', '演讲精彩', '互动有趣', '场地舒适', '服务周到', '收获满满', '期待下次', '时间紧凑', '干货很多', '氛围很好'];
  const comments = [
    '活动组织得非常好，内容充实，收获很大！',
    '演讲嘉宾很专业，学到了很多新知识。',
    '互动环节很有趣，认识了同行业的朋友。',
    '场地设施完善，服务态度很好。',
    '时间安排合理，内容干货满满。',
    '希望下次能有更多实操案例分享。',
    '整体体验不错，期待参加更多活动。',
  ];
  
  return {
    rating: randomInt(3, 5),
    comment: randomItem(comments),
    keywords: [randomItem(keywords), randomItem(keywords)].filter((v, i, a) => a.indexOf(v) === i),
  };
}

function generateAttendee(id: number): Attendee {
  const status = randomItem(statuses);
  const registeredAt = `2026-03-${randomInt(1, 14).toString().padStart(2, '0')}`;
  const checkedInAt = status !== 'registered' ? '2026-03-15' : undefined;
  const leadAt = ['lead', 'deal'].includes(status) ? '2026-03-15' : undefined;
  const dealAmount = status === 'deal' ? randomInt(10, 100) * 1000 : undefined;
  
  return {
    id: `att-${id.toString().padStart(4, '0')}`,
    name: generateName(),
    company: generateCompany(),
    industry: randomItem(industries),
    city: randomItem(cities),
    customerLevel: randomItem(customerLevels),
    status,
    watchDuration: status !== 'registered' && status !== 'checked-in' ? randomInt(15, 180) : 0,
    interactions: ['interacted', 'lead', 'deal'].includes(status) ? randomInt(1, 15) : 0,
    registeredAt,
    checkedInAt,
    leadAt,
    dealAmount,
    channel: randomItem(channels),
    feedback: generateFeedback(),
  };
}

export const attendees: Attendee[] = Array.from({ length: 250 }, (_, i) => generateAttendee(i + 1));

export const feedbackKeywords = [
  { keyword: '内容丰富', count: 85 },
  { keyword: '演讲精彩', count: 72 },
  { keyword: '互动有趣', count: 68 },
  { keyword: '场地舒适', count: 55 },
  { keyword: '服务周到', count: 48 },
  { keyword: '收获满满', count: 92 },
  { keyword: '期待下次', count: 76 },
  { keyword: '干货很多', count: 88 },
  { keyword: '氛围很好', count: 62 },
  { keyword: '时间紧凑', count: 35 },
];

export const feedbackStats = {
  total: 150,
  averageRating: 4.3,
  ratingDistribution: {
    5: 68,
    4: 52,
    3: 22,
    2: 6,
    1: 2,
  },
};