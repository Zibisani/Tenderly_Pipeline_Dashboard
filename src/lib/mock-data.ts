import { Customer, Milestone, Alert, SyncStatus, StageConfig, AlertRule, AlertWithContext, FunnelStageData, STAGE_LABELS } from '../types/domain';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Lesego Mokobi',
    phone_normalised: '71234001',
    current_stage: 1,
    stage_entered_at: new Date(Date.now() - 86400000 * 2),
    next_milestone_type: 'consult_reminder_night_before',
    next_milestone_date: new Date(Date.now() + 86400000),
    cash_received: 0,
    cash_committed: 850,
    cash_expected: 850,
    manual_override: false,
    manual_override_reason: null,
    status_flags: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-2',
    name: 'Kefilwe Nteta',
    phone_normalised: '71234002',
    current_stage: 2,
    stage_entered_at: new Date(Date.now() - 86400000 * 3),
    next_milestone_type: 'quote_follow_up_d2',
    next_milestone_date: new Date(Date.now() - 3600000 * 4),
    cash_received: 350,
    cash_committed: 3500,
    cash_expected: 3500,
    manual_override: false,
    manual_override_reason: null,
    status_flags: ['stuck'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-3',
    name: 'Mpho Seretse',
    phone_normalised: '71234003',
    current_stage: 3,
    stage_entered_at: new Date(Date.now() - 86400000 * 5),
    next_milestone_type: 'delivery_batch',
    next_milestone_date: new Date(Date.now() + 86400000 * 2),
    cash_received: 1400,
    cash_committed: 2800,
    cash_expected: 1400,
    manual_override: false,
    manual_override_reason: null,
    status_flags: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-4',
    name: 'Boitumelo Kgosi',
    phone_normalised: '71234004',
    current_stage: 4,
    stage_entered_at: new Date(Date.now() - 86400000 * 10),
    next_milestone_type: 'balance_due_today',
    next_milestone_date: new Date(Date.now()),
    cash_received: 1400,
    cash_committed: 2800,
    cash_expected: 1400,
    manual_override: false,
    manual_override_reason: null,
    status_flags: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-5',
    name: 'Tebogo Gaothusi',
    phone_normalised: '71234005',
    current_stage: 5,
    stage_entered_at: new Date(Date.now() - 86400000 * 35),
    next_milestone_type: 'week_8_checkin',
    next_milestone_date: new Date(Date.now() + 86400000 * 14),
    cash_received: 4200,
    cash_committed: 4200,
    cash_expected: 0,
    manual_override: false,
    manual_override_reason: null,
    status_flags: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-6',
    name: 'Naledi Pitso',
    phone_normalised: '71234006',
    current_stage: 6,
    stage_entered_at: new Date(Date.now() - 86400000 * 60),
    next_milestone_type: 'membership_payment_today',
    next_milestone_date: new Date(Date.now()),
    cash_received: 2850,
    cash_committed: 950,
    cash_expected: 950,
    manual_override: false,
    manual_override_reason: null,
    status_flags: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-7',
    name: 'Onalenna Dikgale',
    phone_normalised: '71234007',
    current_stage: 7,
    stage_entered_at: new Date(Date.now() - 86400000 * 90),
    next_milestone_type: null,
    next_milestone_date: null,
    cash_received: 5600,
    cash_committed: 5600,
    cash_expected: 0,
    manual_override: false,
    manual_override_reason: null,
    status_flags: [],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cust-8',
    name: 'Bontle Mmileng',
    phone_normalised: '71234008',
    current_stage: 4,
    stage_entered_at: new Date(Date.now() - 86400000 * 18),
    next_milestone_type: 'balance_overdue_3days',
    next_milestone_date: new Date(Date.now() - 86400000 * 2),
    cash_received: 1200,
    cash_committed: 2900,
    cash_expected: 1700,
    manual_override: false,
    manual_override_reason: null,
    status_flags: ['stuck', 'overdue'],
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const MOCK_SYNC_STATUSES: SyncStatus[] = [
  {
    id: 'sync-1',
    source: 'takeapp',
    last_success_at: new Date(Date.now() - 720000),
    last_attempt_at: new Date(Date.now() - 720000),
    last_error: null,
    record_count: 48,
    status: 'ok'
  },
  {
    id: 'sync-2',
    source: 'consultation_sheet',
    last_success_at: new Date(Date.now() - 300000),
    last_attempt_at: new Date(Date.now() - 300000),
    last_error: null,
    record_count: 120,
    status: 'ok'
  },
  {
    id: 'sync-3',
    source: 'membership_sheet',
    last_success_at: new Date(Date.now() - 1080000),
    last_attempt_at: new Date(Date.now() - 1080000),
    last_error: null,
    record_count: 35,
    status: 'ok'
  }
];

export const MOCK_ALERTS: AlertWithContext[] = [
  {
    alert: {
      id: 'alt-1',
      milestone_id: 'ms-8',
      severity: 'red',
      raised_at: new Date(Date.now() - 86400000 * 2),
      status: 'active',
      snoozed_until: null,
      snooze_reason: null,
      dismiss_reason: null,
      acted_by: null,
      acted_at: null,
      suggested_message: 'Hi Bontle Mmileng, your Tenderly balance is overdue. Please arrange payment at your earliest convenience. Thank you!',
      wa_link: 'https://wa.me/26771234008?text=Hi%20Bontle%20Mmileng%2C%20your%20Tenderly%20balance%20is%20overdue.%20Please%20arrange%20payment%20at%20your%20earliest%20convenience.%20Thank%20you!',
      created_at: new Date()
    },
    milestone: {
      id: 'ms-8',
      customer_id: 'cust-8',
      type: 'balance_overdue_3days',
      due_at: new Date(Date.now() - 86400000 * 2),
      status: 'active',
      source: 'takeapp',
      created_at: new Date(),
      updated_at: new Date()
    },
    customer: {
      id: 'cust-8',
      name: 'Bontle Mmileng',
      phone_normalised: '71234008',
      current_stage: 4
    }
  },
  {
    alert: {
      id: 'alt-2',
      milestone_id: 'ms-2',
      severity: 'amber',
      raised_at: new Date(Date.now() - 14400000),
      status: 'active',
      snoozed_until: null,
      snooze_reason: null,
      dismiss_reason: null,
      acted_by: null,
      acted_at: null,
      suggested_message: 'Hi Kefilwe Nteta, following up on your Tenderly consultation quote. Let us know if you have any questions!',
      wa_link: 'https://wa.me/26771234002?text=Hi%20Kefilwe%20Nteta%2C%20following%20up%20on%20your%20Tenderly%20consultation%20quote.%20Let%20us%20know%20if%20you%20have%20any%20questions!',
      created_at: new Date()
    },
    milestone: {
      id: 'ms-2',
      customer_id: 'cust-2',
      type: 'quote_follow_up_d2',
      due_at: new Date(Date.now() - 14400000),
      status: 'pending',
      source: 'consultation_sheet',
      created_at: new Date(),
      updated_at: new Date()
    },
    customer: {
      id: 'cust-2',
      name: 'Kefilwe Nteta',
      phone_normalised: '71234002',
      current_stage: 2
    }
  },
  {
    alert: {
      id: 'alt-3',
      milestone_id: 'ms-1',
      severity: 'normal',
      raised_at: new Date(Date.now() - 3600000),
      status: 'active',
      snoozed_until: null,
      snooze_reason: null,
      dismiss_reason: null,
      acted_by: null,
      acted_at: null,
      suggested_message: 'Hi Lesego Mokobi, just a reminder that your Tenderly consultation is tomorrow. We look forward to seeing you!',
      wa_link: 'https://wa.me/26771234001?text=Hi%20Lesego%20Mokobi%2C%20just%20a%20reminder%20that%20your%20Tenderly%20consultation%20is%20tomorrow.%20We%20look%20forward%20to%20seeing%20you!',
      created_at: new Date()
    },
    milestone: {
      id: 'ms-1',
      customer_id: 'cust-1',
      type: 'consult_reminder_night_before',
      due_at: new Date(Date.now() + 86400000),
      status: 'pending',
      source: 'consultation_sheet',
      created_at: new Date(),
      updated_at: new Date()
    },
    customer: {
      id: 'cust-1',
      name: 'Lesego Mokobi',
      phone_normalised: '71234001',
      current_stage: 1
    }
  }
];

export function getMockFunnelData(): FunnelStageData[] {
  return ([1, 2, 3, 4, 5, 6, 7] as const).map((s) => {
    const stageCusts = MOCK_CUSTOMERS.filter((c) => c.current_stage === s);
    return {
      stage: s,
      label: STAGE_LABELS[s],
      customerCount: stageCusts.length,
      cashReceived: stageCusts.reduce((acc, c) => acc + c.cash_received, 0),
      cashCommitted: stageCusts.reduce((acc, c) => acc + c.cash_committed, 0),
      cashExpected: stageCusts.reduce((acc, c) => acc + c.cash_expected, 0),
      avgDaysInStage: s === 1 ? 2 : s === 2 ? 3 : s === 3 ? 5 : s === 4 ? 14 : s === 5 ? 35 : s === 6 ? 60 : 90,
      stuckCount: stageCusts.filter((c) => c.status_flags.includes('stuck')).length
    };
  });
}