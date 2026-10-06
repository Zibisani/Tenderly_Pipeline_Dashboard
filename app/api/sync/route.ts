import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { writeAuditLog } from '@/lib/audit';

export async function POST() {
  try {
    const { user } = await requireCOO();
    const supabase = createSupabaseServerClient();
    
    const jobId = crypto.randomUUID();
    const startedAt = new Date().toISOString();

    await writeAuditLog(supabase, user.id, user.email || '', 'manual_sync_triggered', 'sync', jobId);

    return ok({ jobId, startedAt });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
