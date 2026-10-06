import { Customer, Milestone, AlertRule, Alert, AlertSeverity, CustomerSummary, MilestoneType, STAGE_LABELS } from '../../types/domain';
import { buildWaLink } from '../phone';

export interface AlertEvaluationInput {
  customer: Customer;
  milestones: Milestone[];
  existingAlerts: Alert[];
  alertRules: AlertRule[];
  now: Date;
}

export interface AlertToCreate {
  milestoneId: string;
  severity: AlertSeverity;
  suggestedMessage: string;
  waLink: string;
}

export function generateWhatsAppMessage(milestoneType: MilestoneType, customer: CustomerSummary, milestone: Milestone): string {
  const customerName = customer.name || 'Valued Client';
  switch (milestoneType) {
    case 'consult_reminder_night_before':
      return `Hi ${customerName}, just a reminder that your Tenderly consultation is tomorrow. We look forward to seeing you!`;
    case 'consult_reminder_30min':
      return `Hi ${customerName}, your Tenderly consultation starts in 30 minutes! See you soon.`;
    case 'quote_follow_up_d2':
      return `Hi ${customerName}, following up on your Tenderly consultation quote. Let us know if you have any questions!`;
    case 'quote_follow_up_d5':
      return `Hi ${customerName}, your consultation quote is expiring soon. Would you like to proceed with your custom protocol?`;
    case 'delivery_batch':
    case 'delivery_batch_missed':
      return `Hi ${customerName}, your Tenderly order batch is scheduled for delivery. Please ensure someone is available.`;
    case 'balance_due_3days':
    case 'balance_due_today':
      return `Hi ${customerName}, a reminder that your Tenderly payment balance is due. Thank you for your business!`;
    case 'balance_overdue_1day':
    case 'balance_overdue_3days':
      return `Hi ${customerName}, your Tenderly balance is overdue. Please arrange payment at your earliest convenience. Thank you!`;
    case 'week_8_checkin':
    case 'week_16_review':
      return `Hi ${customerName}, it's time for your Tenderly skin progress check-in! Let us know how your routine is going.`;
    case 'membership_payment_3days':
    case 'membership_payment_today':
    case 'membership_overdue_1day':
    case 'membership_overdue_3days':
      return `Hi ${customerName}, your Tenderly membership monthly subscription payment notice. Thank you!`;
    default:
      return `Hi ${customerName}, this is a friendly reminder from Tenderly Skincare & Wellness.`;
  }
}

export function evaluateAlerts(input: AlertEvaluationInput): AlertToCreate[] {
  const alerts: AlertToCreate[] = [];
  for (const milestone of input.milestones) {
    if (milestone.status !== 'pending') continue;
    if (input.existingAlerts.some(a => a.milestone_id === milestone.id && (a.status === 'active' || a.status === 'snoozed'))) continue;

    const rule = input.alertRules.find(r => r.milestone_type === milestone.type && r.enabled);
    if (!rule) continue;

    const milestoneTime = new Date(milestone.due_at).getTime();
    const nowTime = new Date(input.now).getTime();
    const timeDiffHrs = (milestoneTime - nowTime) / (1000 * 60 * 60);

    if (rule.lead_times_hours.some(h => timeDiffHrs <= h)) {
      const customerSummary: CustomerSummary = {
        id: input.customer.id,
        name: input.customer.name,
        phone_normalised: input.customer.phone_normalised,
        current_stage: input.customer.current_stage,
        stage_label: STAGE_LABELS[input.customer.current_stage] || `Stage ${input.customer.current_stage}`,
        next_milestone_type: input.customer.next_milestone_type,
        next_milestone_date: input.customer.next_milestone_date,
        cash_received: input.customer.cash_received,
        cash_committed: input.customer.cash_committed,
        cash_expected: input.customer.cash_expected
      };
      const suggestedMessage = generateWhatsAppMessage(milestone.type, customerSummary, milestone);
      alerts.push({
        milestoneId: milestone.id,
        severity: (rule.severities && rule.severities[0]) ? (rule.severities[0] as AlertSeverity) : 'normal',
        suggestedMessage,
        waLink: buildWaLink(input.customer.phone_normalised, suggestedMessage)
      });
    }
  }
  return alerts;
}
