export type FunnelStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const STAGE_LABELS: Record<FunnelStage, string> = {
  1: 'Consult Booked', 2: 'Consulted, Not Converted', 3: 'Reserved / Deposit Paid', 4: 'Delivered, Balance Outstanding', 5: 'Active Protocol', 6: 'Active Membership', 7: 'Completed / Exited',
};
export type MilestoneType = 'consult_reminder_night_before' | 'consult_reminder_30min' | 'quote_follow_up_d2' | 'quote_follow_up_d5' | 'delivery_batch' | 'delivery_batch_missed' | 'balance_due_3days' | 'balance_due_today' | 'balance_overdue_1day' | 'balance_overdue_3days' | 'week_8_checkin' | 'week_16_review' | 'membership_payment_3days' | 'membership_payment_today' | 'membership_overdue_1day' | 'membership_overdue_3days' | 'stuck_in_stage';
export type AlertSeverity = 'normal' | 'amber' | 'red';
export type AlertStatus = 'active' | 'sent' | 'snoozed' | 'dismissed' | 'cleared';
export type UserRole = 'coo' | 'ceo';
export type MilestoneStatus = 'pending' | 'active' | 'done' | 'cancelled';
export type MatchConfidence = 'exact' | 'fuzzy' | 'manual';
export type DataSource = 'consultation_sheet' | 'membership_sheet' | 'takeapp';
export type TicketStatus = 'Unconfirmed' | 'Confirmed' | 'attended' | 'no_show' | 'cancelled';
export type MembershipStatus = 'active' | 'paused' | 'cancelled' | 'completed';
export type OrderStatus = 'draft' | 'pending' | 'reserved' | 'delivered' | 'completed' | 'cancelled';
export type SyncSourceStatus = 'ok' | 'stale' | 'failed' | 'never';
export type ReminderSyncState = 'pending' | 'synced' | 'failed' | 'cancelled';
export type MatchReviewStatus = 'pending' | 'merged' | 'split' | 'dismissed';

export interface Customer { id: string; name: string; phone_normalised: string; current_stage: FunnelStage; stage_entered_at: Date; next_milestone_type: MilestoneType | null; next_milestone_date: Date | null; cash_received: number; cash_committed: number; cash_expected: number; manual_override: boolean; manual_override_reason: string | null; status_flags: string[]; created_at: Date; updated_at: Date; }
export interface SourceLink { id: string; customer_id: string; source: DataSource; source_record_id: string; match_confidence: MatchConfidence; created_at: Date; }
export interface Consultation { id: string; customer_id: string; cl_id: string; ta_ticket: string | null; consult_at: Date; ticket_status: TicketStatus; outcome: string | null; quote_value: number; created_at: Date; updated_at: Date; }
export interface Order { id: string; customer_id: string; takeapp_order_id: string; status: OrderStatus; total: number; paid: number; balance: number; reserved_at: Date | null; batch_delivery_at: Date | null; delivered_at: Date | null; created_at: Date; updated_at: Date; }
export interface Membership { id: string; customer_id: string; tm_id: string; tier: string; monthly_amount: number; kit_price: number; billing_day: number; payments_made: number; balance: number; status: MembershipStatus; created_at: Date; updated_at: Date; }
export interface StageHistory { id: string; customer_id: string; stage: FunnelStage; entered_at: Date; exited_at: Date | null; cause: string; }
export interface Milestone { id: string; customer_id: string; type: MilestoneType; due_at: Date; status: MilestoneStatus; source: DataSource | null; created_at: Date; updated_at: Date; }
export interface Alert { id: string; milestone_id: string; severity: AlertSeverity; raised_at: Date; status: AlertStatus; snoozed_until: Date | null; snooze_reason: string | null; dismiss_reason: string | null; acted_by: string | null; acted_at: Date | null; suggested_message: string; wa_link: string; created_at: Date; }
export interface ReminderSync { id: string; milestone_id: string; ticktick_task_id: string | null; stable_key: string; last_synced_at: Date | null; state: ReminderSyncState; }
export interface MatchReview { id: string; candidate_customer_ids: string[]; reason: string; status: MatchReviewStatus; resolved_by: string | null; resolved_at: Date | null; raw_data: any; created_at: Date; }
export interface AlertRule { id: string; milestone_type: MilestoneType; label: string; lead_times_hours: number[]; severities: AlertSeverity[]; recipients: UserRole[]; enabled: boolean; updated_by: string | null; updated_at: Date; }
export interface StageConfig { id: string; stage: FunnelStage; label: string; description: string; stuck_threshold_days: number | null; updated_by: string | null; updated_at: Date; }
export interface SyncStatus { id: string; source: DataSource; last_success_at: Date | null; last_attempt_at: Date | null; last_error: string | null; record_count: number; status: SyncSourceStatus; }
export interface DataQualityIssue { id: string; source: DataSource; source_record_id: string; issue_type: string; raw_row: any; created_at: Date; resolved: boolean; }
export interface AuditLog { id: string; user_id: string; user_email: string; action: string; target_type: string; target_id: string; metadata: any; created_at: Date; }
export interface AppUser { id: string; name: string; email: string; role: UserRole; mfa_enabled: boolean; last_active_at: Date | null; push_subscribed: boolean; }

export interface FunnelStageData { stage: FunnelStage; label: string; customerCount: number; cashReceived: number; cashCommitted: number; cashExpected: number; avgDaysInStage: number; stuckCount: number; }
export interface FunnelOverview { stages: FunnelStageData[]; activeAlertCount: number; totalStuckCount: number; syncStatuses: SyncStatus[]; lastUpdatedAt: string; }
export interface CustomerSummary { id: string; name: string; phone_normalised: string; current_stage: FunnelStage; stage_label: string; next_milestone_type: MilestoneType | null; next_milestone_date: Date | null; cash_received: number; cash_committed: number; cash_expected: number; }
export interface CustomerCard { customer: Customer; consultations: Consultation[]; orders: Order[]; membership: Membership | null; stage_history: StageHistory[]; source_links: SourceLink[]; next_milestone: Milestone | null; active_alerts: Alert[]; }
export interface AlertWithContext { alert: Alert; milestone: Milestone; customer: { id: string; name: string; phone_normalised: string; current_stage: FunnelStage; }; }
