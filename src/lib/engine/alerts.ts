import { Customer, Milestone, AlertRule, Alert, AlertSeverity, CustomerSummary, MilestoneType } from '../../types/domain';
import { buildWaLink } from '../phone';
export interface AlertEvaluationInput { customer: Customer; milestones: Milestone[]; existingAlerts: Alert[]; alertRules: AlertRule[]; now: Date; }
export interface AlertToCreate { milestoneId: string; severity: AlertSeverity; suggestedMessage: string; waLink: string; }

export function generateWhatsAppMessage(milestoneType: MilestoneType, customer: CustomerSummary, milestone: Milestone): string {
  switch (milestoneType) {
    case 'consult_reminder_night_before': return Hi , just a reminder that your Tenderly consultation is tomorrow. We look forward to seeing you! ??;
    case 'balance_overdue_3days': return Hi , your Tenderly balance is now 3 days overdue. Please arrange payment at your earliest convenience. Thank you!;
    default: return Hi , this is a friendly reminder from Tenderly.;
  }
}

export function evaluateAlerts(input: AlertEvaluationInput): AlertToCreate[] {
  const alerts: AlertToCreate[] = [];
  for (const milestone of input.milestones) {
    if (milestone.status !== 'pending') continue;
    if (input.existingAlerts.some(a => a.milestone_id === milestone.id && (a.status === 'active' || a.status === 'snoozed'))) continue;
    const rule = input.alertRules.find(r => r.milestone_type === milestone.type && r.enabled);
    if (!rule) continue;
    const timeDiffHrs = (milestone.due_at.getTime() - input.now.getTime()) / (1000 * 60 * 60);
    if (rule.lead_times_hours.some(h => timeDiffHrs <= h)) {
      const suggestedMessage = generateWhatsAppMessage(milestone.type, input.customer as unknown as CustomerSummary, milestone);
      alerts.push({ milestoneId: milestone.id, severity: rule.severities[0] || 'normal', suggestedMessage, waLink: buildWaLink(input.customer.phone_normalised, suggestedMessage) });
    }
  }
  return alerts;
}
