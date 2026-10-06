import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { writeAuditLog } from '@/lib/audit';
import { z } from 'zod';

const ActionSchema = z.object({
  action: z.enum(['mark_sent', 'snooze', 'dismiss']),
  reason: z.string().optional(),
  snoozedUntil: z.string().optional()
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { user } = await requireCOO();
    const body = await request.json();
    const parsed = ActionSchema.parse(body);

    const supabase = createSupabaseServerClient();
    
    const updateData: any = { status: parsed.action, acted_by: user.id, acted_at: new Date().toISOString() };
    if (parsed.action === 'snooze' && parsed.snoozedUntil) updateData.snoozed_until = parsed.snoozedUntil;

    const { data, error } = await supabase.from('alerts').update(updateData).eq('id', params.id).select().single();
    if (error) throw error;

    await writeAuditLog(supabase, user.id, user.email || '', 'alert_acted', 'alerts', params.id, parsed);

    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    if (e instanceof z.ZodError) return err('Validation failed', 400);
    return err(e.message, 500);
  }
}
