export function formatBWP(amount: number): string {
  return new Intl.NumberFormat('en-BW', { style: 'currency', currency: 'BWP', minimumFractionDigits: 2 }).format(amount);
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Gaborone' }).format(d).replace(/ /g, ' ');
}

export function formatRelative(date: string | Date | null, now = new Date()): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffDays = Math.round((d.getTime() - now.getTime()) / 86400000);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
}

export function daysSince(date: string | Date | null, now = new Date()): number {
  if (!date) return 0;
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor((now.getTime() - d.getTime()) / 86400000);
}

export type FunnelStage = 'new' | 'consultation' | 'active' | 'churned';

export function stageLabel(stage: FunnelStage | string): string {
  const labels: Record<string, string> = { new: 'New Lead', consultation: 'Consultation', active: 'Active Customer', churned: 'Churned' };
  return labels[stage] || stage;
}

export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\s+/g, '');
  if (cleaned.startsWith('267')) cleaned = cleaned.substring(3);
  return cleaned;
}
