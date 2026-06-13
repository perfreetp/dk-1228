export function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString();
}

export function formatCurrency(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString() + '元';
}

export function formatPercent(num: number): string {
  return num.toFixed(1) + '%';
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return minutes + '分钟';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours + '小时' + (mins > 0 ? mins + '分钟' : '');
}

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
}

export function calculateCPA(cost: number, leads: number): number {
  if (leads === 0) return 0;
  return cost / leads;
}

export function calculateConversionRate(from: number, to: number): number {
  if (from === 0) return 0;
  return (to / from) * 100;
}

export function getTrendDirection(current: number, previous: number): 'up' | 'down' | 'stable' {
  const diff = current - previous;
  if (diff > 0) return 'up';
  if (diff < 0) return 'down';
  return 'stable';
}

export function getTrendPercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}