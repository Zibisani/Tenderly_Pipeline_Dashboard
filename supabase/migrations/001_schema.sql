-- 001_schema.sql
-- Tenderly Pipeline Dashboard — Database Schema
-- Eleve Proprietary Limited, Gaborone, Botswana

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION is_coo() RETURNS BOOLEAN AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'coo';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_ceo() RETURNS BOOLEAN AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'role') = 'ceo';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone_normalised VARCHAR(20) UNIQUE NOT NULL,
    current_stage SMALLINT CHECK (current_stage BETWEEN 1 AND 7),
    stage_entered_at TIMESTAMPTZ,
    next_milestone_type TEXT,
    next_milestone_date TIMESTAMPTZ,
    cash_received NUMERIC(12,2) DEFAULT 0,
    cash_committed NUMERIC(12,2) DEFAULT 0,
    cash_expected NUMERIC(12,2) DEFAULT 0,
    manual_override BOOLEAN DEFAULT false,
    manual_override_reason TEXT,
    manual_override_stage SMALLINT,
    status_flags JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_customers_phone ON customers(phone_normalised);
CREATE INDEX idx_customers_stage ON customers(current_stage);

CREATE TABLE source_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    source TEXT CHECK (source IN ('consultation', 'membership', 'takeapp')),
    source_record_id TEXT NOT NULL,
    match_confidence TEXT CHECK (match_confidence IN ('exact', 'fuzzy', 'manual')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(source, source_record_id)
);

CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    cl_id TEXT UNIQUE,
    ta_ticket TEXT,
    consult_at TIMESTAMPTZ,
    ticket_status TEXT CHECK (ticket_status IN ('Unconfirmed', 'Confirmed', 'attended', 'no_show', 'cancelled')),
    outcome TEXT,
    quote_value NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_consultations_customer ON consultations(customer_id);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    takeapp_order_id TEXT UNIQUE,
    status TEXT CHECK (status IN ('draft','pending','reserved','delivered','completed','cancelled')),
    total NUMERIC(12,2),
    paid NUMERIC(12,2),
    balance NUMERIC(12,2) GENERATED ALWAYS AS (total - paid) STORED,
    reserved_at TIMESTAMPTZ,
    batch_delivery_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_orders_customer ON orders(customer_id);

CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    tm_id TEXT UNIQUE,
    tier TEXT,
    monthly_amount NUMERIC(12,2),
    kit_price NUMERIC(12,2),
    billing_day SMALLINT CHECK (billing_day BETWEEN 1 AND 31),
    payments_made INTEGER DEFAULT 0,
    balance NUMERIC(12,2) DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'paused', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    stage SMALLINT CHECK (stage BETWEEN 1 AND 7),
    entered_at TIMESTAMPTZ NOT NULL,
    exited_at TIMESTAMPTZ,
    cause TEXT
);
CREATE INDEX idx_stage_history_customer ON stage_history(customer_id, entered_at);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    due_at TIMESTAMPTZ,
    status TEXT CHECK (status IN ('pending', 'active', 'done', 'cancelled')) DEFAULT 'pending',
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id, type, due_at)
);
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_milestones_customer_due ON milestones(customer_id, due_at);
CREATE INDEX idx_milestones_status ON milestones(status);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    severity TEXT CHECK (severity IN ('normal', 'amber', 'red')),
    raised_at TIMESTAMPTZ DEFAULT now(),
    status TEXT CHECK (status IN ('active','sent','snoozed','dismissed','cleared')) DEFAULT 'active',
    snoozed_until TIMESTAMPTZ,
    snooze_reason TEXT,
    dismiss_reason TEXT,
    acted_by UUID REFERENCES auth.users(id),
    acted_at TIMESTAMPTZ,
    suggested_message TEXT,
    wa_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);

CREATE TABLE reminder_syncs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    ticktick_task_id TEXT,
    stable_key TEXT UNIQUE NOT NULL,
    last_synced_at TIMESTAMPTZ,
    state TEXT CHECK (state IN ('pending','synced','failed','cancelled')) DEFAULT 'pending'
);

CREATE TABLE match_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_customer_ids UUID[],
    reason TEXT,
    status TEXT CHECK (status IN ('pending','merged','split','dismissed')) DEFAULT 'pending',
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_type TEXT NOT NULL,
    label TEXT,
    lead_times_hours INTEGER[] DEFAULT '{}',
    severities TEXT[],
    recipients TEXT[] DEFAULT ARRAY['coo','ceo'],
    enabled BOOLEAN DEFAULT true,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON alert_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE stage_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage SMALLINT UNIQUE NOT NULL CHECK (stage BETWEEN 1 AND 7),
    label TEXT NOT NULL,
    description TEXT,
    stuck_threshold_days INTEGER,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_stage_configs_updated_at BEFORE UPDATE ON stage_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT UNIQUE NOT NULL CHECK (source IN ('consultation_sheet','membership_sheet','takeapp')),
    last_success_at TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ,
    last_error TEXT,
    record_count INTEGER,
    status TEXT CHECK (status IN ('ok','stale','failed','never')) DEFAULT 'never'
);

CREATE TABLE data_quality (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT,
    source_record_id TEXT,
    issue_type TEXT,
    raw_row JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved BOOLEAN DEFAULT false
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);

CREATE TABLE push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT,
    p256dh TEXT,
    auth TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_syncs ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_source_links" ON source_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_consultations" ON consultations FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_memberships" ON memberships FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_stage_history" ON stage_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_milestones" ON milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_reminder_syncs" ON reminder_syncs FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_match_reviews" ON match_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_alert_rules" ON alert_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_stage_configs" ON stage_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_sync_status" ON sync_status FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_read_data_quality" ON data_quality FOR SELECT TO authenticated USING (true);

CREATE POLICY "coo_write_alert_rules" ON alert_rules FOR ALL TO authenticated USING (is_coo()) WITH CHECK (is_coo());
CREATE POLICY "coo_write_stage_configs" ON stage_configs FOR ALL TO authenticated USING (is_coo()) WITH CHECK (is_coo());
CREATE POLICY "coo_write_match_reviews" ON match_reviews FOR ALL TO authenticated USING (is_coo()) WITH CHECK (is_coo());
CREATE POLICY "coo_update_data_quality" ON data_quality FOR UPDATE TO authenticated USING (is_coo());
CREATE POLICY "coo_update_alerts" ON alerts FOR UPDATE TO authenticated USING (is_coo());

CREATE POLICY "own_push_sub_select" ON push_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_push_sub_insert" ON push_subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_push_sub_update" ON push_subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_push_sub_delete" ON push_subscriptions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "coo_read_audit_logs" ON audit_logs FOR SELECT TO authenticated USING (is_coo());
CREATE POLICY "service_insert_audit" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);
