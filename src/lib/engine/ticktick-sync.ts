import { Milestone, CustomerSummary, AlertSeverity } from '../../types/domain';
import { TickTickAdapter } from '../../types/integrations';

export function buildStableKey(customerId: string, milestoneType: string, dueDateISO: string): string {
  return `tenderly:${customerId}:${milestoneType}:${dueDateISO}`;
}

export function buildTickTickTaskTitle(milestoneType: string, customerName: string): string {
  return `[Tenderly] ${milestoneType} - ${customerName}`;
}

export function computeTickTickPriority(severity: AlertSeverity): 0 | 1 | 3 | 5 {
  switch (severity) {
    case 'red': return 5;
    case 'amber': return 3;
    case 'normal': return 1;
    default: return 0;
  }
}

export async function syncMilestoneToTickTick(
  milestone: Milestone,
  customer: CustomerSummary,
  adapter: TickTickAdapter
): Promise<void> {
  const dueDateStr = typeof milestone.due_at === 'string' ? milestone.due_at : milestone.due_at.toISOString();
  const stableKey = buildStableKey(customer.id, milestone.type, dueDateStr);
  const existing = await adapter.findByStableKey(stableKey);

  if (milestone.status === 'done' || milestone.status === 'cancelled') {
    if (existing) {
      await adapter.completeTask(existing.id);
    }
    return;
  }

  const title = buildTickTickTaskTitle(milestone.type, customer.name);
  if (!existing) {
    await adapter.createTask({
      title,
      content: `Milestone: ${milestone.type} for ${customer.name}`,
      dueDate: dueDateStr,
      isAllDay: false,
      priority: computeTickTickPriority('normal'),
      tags: [stableKey]
    });
  } else {
    await adapter.updateTask(existing.id, {
      title,
      dueDate: dueDateStr
    });
  }
}
