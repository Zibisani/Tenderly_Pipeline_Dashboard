import { FunnelStage, Customer, Consultation, Order, Membership, MilestoneType } from '../../types/domain';
export interface StageComputationInput { customer: Customer; consultations: Consultation[]; orders: Order[]; membership: Membership | null; now: Date; }
export interface StageComputationResult { stage: FunnelStage; cause: string; nextMilestoneType: MilestoneType | null; nextMilestoneDate: Date | null; }

export function computeNextFriday(from: Date): Date { const date = new Date(from); const diff = date.getDate() + ((12 - date.getDay()) % 7) || 7; date.setDate(diff); return date; }
export function computeWeek8Date(deliveredAt: Date): Date { const date = new Date(deliveredAt); date.setDate(date.getDate() + 56); return date; }
export function computeWeek16Date(deliveredAt: Date): Date { const date = new Date(deliveredAt); date.setDate(date.getDate() + 112); return date; }
export function computeNextBillingDate(billingDay: number, from: Date): Date {
  let date = new Date(from); let nextMonth = date.getMonth(); let year = date.getFullYear();
  if (date.getDate() >= billingDay) { nextMonth++; if (nextMonth > 11) { nextMonth = 0; year++; } }
  const lastDay = new Date(year, nextMonth + 1, 0).getDate(); const targetDay = Math.min(billingDay, lastDay);
  return new Date(year, nextMonth, targetDay);
}
export function isWithin16Weeks(deliveredAt: Date, now: Date): boolean { return Math.ceil(Math.abs(now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24)) <= 112; }

export function computeStage(input: StageComputationInput): StageComputationResult {
  const { customer, consultations, orders, membership, now } = input;
  if (membership?.status === 'active') return { stage: 6, cause: 'active_membership', nextMilestoneType: 'membership_payment_3days', nextMilestoneDate: null };
  const futureConsults = consultations.filter(c => c.consult_at > now && (c.ticket_status === 'Unconfirmed' || c.ticket_status === 'Confirmed'));
  if (futureConsults.length > 0) return { stage: 1, cause: 'future_consultation', nextMilestoneType: 'consult_reminder_night_before', nextMilestoneDate: futureConsults[0].consult_at };
  const attendedConsults = consultations.filter(c => c.ticket_status === 'attended');
  const paidOrders = orders.filter(o => o.paid > 0);
  if (attendedConsults.length > 0 && paidOrders.length === 0) return { stage: 2, cause: 'attended_no_deposit', nextMilestoneType: 'quote_follow_up_d2', nextMilestoneDate: null };
  const reservedOrders = orders.filter(o => (o.status === 'reserved' || o.status === 'pending') && o.paid > 0);
  if (reservedOrders.length > 0) return { stage: 3, cause: 'deposit_paid', nextMilestoneType: 'delivery_batch', nextMilestoneDate: computeNextFriday(now) };
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  if (deliveredOrders.some(o => o.balance > 0)) return { stage: 4, cause: 'delivered_balance_due', nextMilestoneType: 'balance_due_3days', nextMilestoneDate: null };
  const activeProtocols = deliveredOrders.filter(o => o.balance === 0 && o.delivered_at && isWithin16Weeks(new Date(o.delivered_at), now));
  if (activeProtocols.length > 0) return { stage: 5, cause: 'active_protocol_within_16w', nextMilestoneType: 'week_8_checkin', nextMilestoneDate: computeWeek8Date(new Date(activeProtocols[0].delivered_at!)) };
  return { stage: 7, cause: 'completed_or_exited', nextMilestoneType: null, nextMilestoneDate: null };
}
