import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { writeAuditLog } from '@/lib/audit';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { user } = await requireCOO();
    const { action } = await request.json(); // merge, split, dismiss
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase.from('match_reviews').update({ status: 'resolved', resolution: action }).eq('id', params.id).select().single();
    if (error) throw error;

    await writeAuditLog(supabase, user.id, user.email || '', `match_review_${action}`, 'match_reviews', params.id);

    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
