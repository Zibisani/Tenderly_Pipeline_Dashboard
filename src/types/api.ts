import { FunnelOverview, CustomerSummary, CustomerCard, FunnelStage, AlertStatus, AlertSeverity, AlertWithContext, Alert, SyncStatus, MatchReview, AlertRule, StageConfig, AppUser, UserRole, DataQualityIssue, AuditLog } from './domain';
export interface FunnelResponse { overview: FunnelOverview; }
export interface CustomerSearchParams { q?: string; phone?: string; stage?: FunnelStage; limit?: number; offset?: number; }
export interface CustomerSearchResponse { customers: CustomerSummary[]; total: number; }
export interface CustomerCardResponse { customer: CustomerCard; }
export interface AlertsParams { status?: AlertStatus | 'all'; severity?: AlertSeverity; limit?: number; offset?: number; }
export interface AlertsResponse { alerts: AlertWithContext[]; total: number; }
export interface AlertActionRequest { action: 'mark_sent' | 'snooze' | 'dismiss'; reason?: string; snoozedUntil?: string; }
export interface AlertActionResponse { alert: Alert; }
export interface SyncTriggerResponse { jobId: string; startedAt: string; }
export interface SyncStatusResponse { sources: SyncStatus[]; }
export interface MatchReviewsResponse { reviews: MatchReview[]; total: number; }
export interface MatchReviewActionRequest { action: 'merge' | 'split' | 'dismiss'; primaryCustomerId?: string; }
export interface RulesResponse { alertRules: AlertRule[]; stageConfigs: StageConfig[]; }
export interface RulesUpdateRequest { alertRules?: Partial<AlertRule>[]; stageConfigs?: Partial<StageConfig>[]; }
export interface UsersResponse { users: AppUser[]; }
export interface CreateUserRequest { name: string; email: string; role: UserRole; }
export interface ExportParams { format: 'csv' | 'json'; stage?: FunnelStage; }
export interface DataQualityResponse { issues: DataQualityIssue[]; total: number; }
export interface AuditParams { limit?: number; offset?: number; action?: string; }
export interface AuditResponse { logs: AuditLog[]; total: number; }
export interface ApiError { error: string; code?: string; }
export interface ApiSuccess<T> { data: T; }
