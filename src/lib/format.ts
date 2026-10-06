export function formatBWP(amount: number): string {
  return new Intl.NumberFormat('en-BW', { style: 'currency', currency: 'BWP', minimumFractionDigits: 2 }).format(amount);
}

export function formatDate(date: string | Date | null): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Gaborone' }).format(d);
}

export function formatDateDisplay(date: string | Date | null): string {
  return formatDate(date);
}

export function formatTimeAgo(date: string | Date | null, now = new Date()): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMinutes = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
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