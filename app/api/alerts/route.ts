import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const severity = searchParams.get('severity');

    const supabase = await createSupabaseServerClient();
    let query = supabase.from('alerts').select('*, milestones(*), customers(*)').eq('status', status);
    if (severity) query = query.eq('severity', severity);

    const { data, error } = await query.order('raised_at', { ascending: false });
    if (error) throw error;

    return ok(data || []);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
