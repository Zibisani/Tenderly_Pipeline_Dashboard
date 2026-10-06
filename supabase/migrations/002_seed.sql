-- 002_seed.sql — Default config and mock customer data

INSERT INTO alert_rules (milestone_type, label, lead_times_hours, severities, recipients) VALUES
('consultation_reminder_night_before', 'Consultation Reminder (Night Before)', ARRAY[20], ARRAY['normal'], ARRAY['coo','ceo']),
('consultation_reminder_30min', 'Consultation Reminder (30 Min Before)', ARRAY[0], ARRAY['normal'], ARRAY['coo']),
('quote_follow_up_d2', 'Quote Follow-up (Day 2)', ARRAY[48], ARRAY['amber'], ARRAY['coo']),
('quote_follow_up_d5', 'Quote Follow-up (Day 5)', ARRAY[120], ARRAY['red'], ARRAY['coo','ceo']),
('delivery_batch_2days', 'Delivery Batch (2 Days Before)', ARRAY[48], ARRAY['normal'], ARRAY['coo']),
('delivery_batch_missed', 'Delivery Batch Missed', ARRAY[0], ARRAY['red'], ARRAY['coo','ceo']),
('balance_due_3days', 'Balance Due (3 Days Before)', ARRAY[72], ARRAY['normal'], ARRAY['coo']),
('balance_due_today', 'Balance Due Today', ARRAY[0], ARRAY['amber'], ARRAY['coo','ceo']),
('balance_overdue_1day', 'Balance Overdue (1 Day)', ARRAY[-24], ARRAY['amber'], ARRAY['coo','ceo']),
('balance_overdue_3days', 'Balance Overdue (3 Days)', ARRAY[-72], ARRAY['red'], ARRAY['coo','ceo']),
('week_8_checkin_3days', 'Week-8 Check-in (3 Days Before)', ARRAY[72], ARRAY['normal'], ARRAY['coo']),
('week_16_review', 'Week-16 Protocol Review', ARRAY[72], ARRAY['normal'], ARRAY['coo']),
('membership_payment_3days', 'Membership Payment (3 Days Before)', ARRAY[72], ARRAY['normal'], ARRAY['coo']),
('membership_payment_today', 'Membership Payment Due Today', ARRAY[0], ARRAY['amber'], ARRAY['coo','ceo']),
('membership_overdue_1day', 'Membership Overdue (1 Day)', ARRAY[-24], ARRAY['amber'], ARRAY['coo','ceo']),
('membership_overdue_3days', 'Membership Overdue (3 Days)', ARRAY[-72], ARRAY['red'], ARRAY['coo','ceo']),
('stuck_in_stage', 'Stuck In Stage', ARRAY[0], ARRAY['amber'], ARRAY['coo']);

INSERT INTO stage_configs (stage, label, description, stuck_threshold_days) VALUES
(1, 'Consult Booked', 'Future consultation booked, ticket Unconfirmed/Confirmed', 14),
(2, 'Consulted, Not Converted', 'Attended consultation, no deposit or order yet', 7),
(3, 'Reserved / Deposit Paid', 'Order reserved or pending, deposit paid', 30),
(4, 'Delivered, Balance Outstanding', 'Products delivered, balance still owed', 14),
(5, 'Active Protocol', 'Delivered and fully paid, within 16-week guarantee', 120),
(6, 'Active Membership', 'Active monthly membership', 35),
(7, 'Completed / Exited', 'Finished, cancelled, or lost', NULL);

INSERT INTO sync_status (source, status) VALUES
('consultation_sheet', 'never'),
('membership_sheet', 'never'),
('takeapp', 'never');

-- Mock customers (8 Botswana customers across all 7 stages)
DO $$
DECLARE
  cust1 UUID := uuid_generate_v4();
  cust2 UUID := uuid_generate_v4();
  cust3 UUID := uuid_generate_v4();
  cust4 UUID := uuid_generate_v4();
  cust5 UUID := uuid_generate_v4();
  cust6 UUID := uuid_generate_v4();
  cust7 UUID := uuid_generate_v4();
  cust8 UUID := uuid_generate_v4();
  ms_cust8 UUID := uuid_generate_v4();
  ms_cust4 UUID := uuid_generate_v4();
BEGIN

INSERT INTO customers (id, name, phone_normalised, current_stage, stage_entered_at, cash_received, cash_committed, cash_expected) VALUES
(cust1, 'Lesego Mokobi',    '71234001', 1, now() - INTERVAL '1 day',    0,    0,    0),
(cust2, 'Kefilwe Nteta',    '71234002', 2, now() - INTERVAL '3 days',   0,    2800, 2800),
(cust3, 'Mpho Seretse',     '71234003', 3, now() - INTERVAL '5 days',   1400, 1400, 0),
(cust4, 'Boitumelo Kgosi',  '71234004', 4, now() - INTERVAL '10 days',  1400, 1400, 0),
(cust5, 'Tebogo Gaothusi',  '71234005', 5, now() - INTERVAL '35 days',  2800, 0,    0),
(cust6, 'Naledi Pitso',     '71234006', 6, now() - INTERVAL '45 days',  1900, 0,    5700),
(cust7, 'Onalenna Dikgale', '71234007', 7, now() - INTERVAL '180 days', 5000, 0,    0),
(cust8, 'Bontle Mmileng',   '71234008', 4, now() - INTERVAL '20 days',  1500, 1500, 0);

INSERT INTO source_links (customer_id, source, source_record_id, match_confidence) VALUES
(cust1, 'consultation', 'CL-001', 'exact'),
(cust2, 'consultation', 'CL-002', 'exact'),
(cust3, 'consultation', 'CL-003', 'exact'),
(cust3, 'takeapp', 'TA-003', 'exact'),
(cust4, 'takeapp', 'TA-004', 'exact'),
(cust5, 'takeapp', 'TA-005', 'exact'),
(cust6, 'membership', 'TM-006', 'exact'),
(cust6, 'takeapp', 'TA-006', 'exact'),
(cust7, 'takeapp', 'TA-007', 'exact'),
(cust8, 'takeapp', 'TA-008', 'exact');

INSERT INTO consultations (customer_id, cl_id, consult_at, ticket_status, outcome, quote_value) VALUES
(cust1, 'CL-001', now() + INTERVAL '1 day', 'Confirmed', NULL, NULL),
(cust2, 'CL-002', now() - INTERVAL '3 days', 'attended', 'Interested, awaiting decision', 2800),
(cust3, 'CL-003', now() - INTERVAL '20 days', 'attended', 'Converted to order', 2800);

INSERT INTO orders (customer_id, takeapp_order_id, status, total, paid, reserved_at, delivered_at) VALUES
(cust3, 'TA-003', 'reserved', 2800, 1400, now() - INTERVAL '5 days', NULL),
(cust4, 'TA-004', 'delivered', 2800, 1400, now() - INTERVAL '14 days', now() - INTERVAL '10 days'),
(cust5, 'TA-005', 'delivered', 2800, 2800, now() - INTERVAL '40 days', now() - INTERVAL '35 days'),
(cust6, 'TA-006', 'delivered', 3800, 3800, now() - INTERVAL '50 days', now() - INTERVAL '45 days'),
(cust7, 'TA-007', 'completed', 5000, 5000, now() - INTERVAL '185 days', now() - INTERVAL '180 days'),
(cust8, 'TA-008', 'delivered', 3000, 1500, now() - INTERVAL '25 days', now() - INTERVAL '20 days');

INSERT INTO memberships (customer_id, tm_id, tier, monthly_amount, kit_price, billing_day, payments_made, balance, status) VALUES
(cust6, 'TM-006', 'Glow Gold', 950, 0, 31, 4, 0, 'active');

INSERT INTO stage_history (customer_id, stage, entered_at, exited_at, cause) VALUES
(cust1, 1, now() - INTERVAL '1 day', NULL, 'consult_booked'),
(cust2, 1, now() - INTERVAL '7 days', now() - INTERVAL '3 days', 'consultation_attended'),
(cust2, 2, now() - INTERVAL '3 days', NULL, 'no_order'),
(cust3, 1, now() - INTERVAL '25 days', now() - INTERVAL '20 days', 'consultation_attended'),
(cust3, 2, now() - INTERVAL '20 days', now() - INTERVAL '5 days', 'deposit_paid'),
(cust3, 3, now() - INTERVAL '5 days', NULL, 'order_reserved'),
(cust4, 3, now() - INTERVAL '14 days', now() - INTERVAL '10 days', 'order_delivered'),
(cust4, 4, now() - INTERVAL '10 days', NULL, 'balance_outstanding'),
(cust5, 5, now() - INTERVAL '35 days', NULL, 'fully_paid'),
(cust6, 6, now() - INTERVAL '45 days', NULL, 'active_membership'),
(cust7, 7, now() - INTERVAL '180 days', NULL, 'protocol_complete'),
(cust8, 3, now() - INTERVAL '25 days', now() - INTERVAL '20 days', 'order_delivered'),
(cust8, 4, now() - INTERVAL '20 days', NULL, 'balance_outstanding');

INSERT INTO milestones (id, customer_id, type, due_at, status) VALUES
(ms_cust8, cust8, 'balance_overdue_3days', now() - INTERVAL '2 days', 'active'),
(ms_cust4, cust4, 'balance_due_3days', now() + INTERVAL '1 day', 'active');

INSERT INTO alerts (milestone_id, severity, status, suggested_message, wa_link) VALUES
(ms_cust8, 'red', 'active',
  'Hi Bontle, your Tenderly balance of BWP 1,500 is now 2 days overdue. Please arrange payment at your earliest convenience. We appreciate your support!',
  'https://wa.me/26771234008?text=Hi+Bontle%2C+your+Tenderly+balance+of+BWP+1%2C500+is+now+2+days+overdue.'),
(ms_cust4, 'normal', 'active',
  'Hi Boitumelo, just a reminder that your Tenderly balance of BWP 1,400 is due tomorrow. Please arrange payment. Thank you!',
  'https://wa.me/26771234004?text=Hi+Boitumelo%2C+your+Tenderly+balance+of+BWP+1%2C400+is+due+tomorrow.');

END $$;
