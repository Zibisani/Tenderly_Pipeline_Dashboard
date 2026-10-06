import { requireAuth, requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { writeAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    await requireAuth();
    const supabase = await createSupabaseServerClient();

    const { data: alertRules, error: rErr } = await supabase.from('alert_rules').select('*');
    const { data: stageConfigs, error: sErr } = await supabase.from('stage_configs').select('*');

    if (rErr) throw rErr;
    if (sErr) throw sErr;

    return ok({ alertRules: alertRules || [], stageConfigs: stageConfigs || [] });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireCOO();
    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    if (body.alertRules) {
      for (const rule of body.alertRules) {
        await supabase.from('alert_rules').update({ ...rule, updated_by: user.id, updated_at: new Date().toISOString() }).eq('id', rule.id);
      }
    }

    if (body.stageConfigs) {
      for (const cfg of body.stageConfigs) {
        await supabase.from('stage_configs').update({ ...cfg, updated_by: user.id, updated_at: new Date().toISOString() }).eq('id', cfg.id);
      }
    }

    await writeAuditLog(supabase, user.id, user.email || '', 'rules_updated', 'system', 'rules', body);

    return ok({ success: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
