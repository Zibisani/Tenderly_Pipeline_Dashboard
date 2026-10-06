import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const supabase = createSupabaseServerClient();
    let query = supabase.from('alerts').select('*, milestones(*), customers(*)').eq('status', status).limit(limit).range(offset, offset + limit - 1);
    if (severity) query = query.eq('severity', severity);
    
    query = query.order('due_at', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
