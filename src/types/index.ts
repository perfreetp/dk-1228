export type ActivityType = 'launch' | 'exhibition' | 'livestream';
export type ChannelType = 'wechat' | 'weibo' | 'email' | 'sms' | 'ads' | 'offline' | 'other';
export type CustomerLevel = 'A' | 'B' | 'C' | 'D' | 'new';
export type AttendeeStatus = 'registered' | 'checked-in' | 'viewed' | 'interacted' | 'lead' | 'deal';

export interface ActivityMetrics {
  registrations: number;
  checkIns: number;
  viewers: number;
  interactions: number;
  leads: number;
  deals: number;
  dealAmount: number;
}

export interface ActivityTarget {
  registrations: number;
  checkIns: number;
  leads: number;
  deals: number;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  cost: number;
  registrations: number;
  checkIns: number;
  leads: number;
  deals: number;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  target: ActivityTarget;
  budget: number;
  channels: Channel[];
  metrics: ActivityMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  rating: number;
  comment: string;
  keywords: string[];
}

export interface Attendee {
  id: string;
  name: string;
  company: string;
  industry: string;
  city: string;
  customerLevel: CustomerLevel;
  status: AttendeeStatus;
  watchDuration: number;
  interactions: number;
  registeredAt: string;
  checkedInAt?: string;
  leadAt?: string;
  dealAmount?: number;
  channel: string;
  feedback?: Feedback;
}

export interface ReportSection {
  type: 'metrics' | 'chart' | 'table' | 'text';
  title: string;
  data: unknown;
}

export interface ReportNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ShareSettings {
  enabled: boolean;
  link: string;
  expiresAt?: string;
  permissions: ('view' | 'export')[];
}

export interface Report {
  id: string;
  activityId: string;
  title: string;
  createdAt: string;
  createdBy: string;
  sections: ReportSection[];
  notes: ReportNote[];
  shareSettings?: ShareSettings;
}

export interface TrendData {
  time: string;
  value: number;
}

export interface FunnelData {
  stage: string;
  count: number;
  rate: number;
  dropRate: number;
}

export interface DistributionData {
  name: string;
  value: number;
  percentage: number;
}

export interface AttendeeFilters {
  search?: string;
  cities?: string[];
  industries?: string[];
  customerLevels?: CustomerLevel[];
  statuses?: AttendeeStatus[];
  channels?: string[];
}