import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    await requireCOO();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const supabase = createSupabaseServerClient();
    let query = supabase.from('audit_logs').select('*').limit(limit).range(offset, offset + limit - 1).order('created_at', { ascending: false });
    if (action) query = query.eq('action', action);

    const { data, error } = await query;
    if (error) throw error;
    
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
