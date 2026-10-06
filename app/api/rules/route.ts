import { requireAuth, requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

export async function GET() {
  try {
    await requireAuth();
    const supabase = createSupabaseServerClient();
    const [rules, configs] = await Promise.all([
      supabase.from('alert_rules').select('*'),
      supabase.from('stage_configs').select('*')
    ]);
    
    return ok({ alert_rules: rules.data, stage_configs: configs.data });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireCOO();
    const body = await request.json();
    const RulesSchema = z.object({ alert_rules: z.array(z.any()).optional(), stage_configs: z.array(z.any()).optional() });
    const parsed = RulesSchema.parse(body);

    const supabase = createSupabaseServerClient();

    await writeAuditLog(supabase, user.id, user.email || '', 'rules_updated', undefined, undefined, parsed);

    return ok({ success: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
