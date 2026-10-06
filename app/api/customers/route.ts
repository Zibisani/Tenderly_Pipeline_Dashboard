import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';
import { normalizePhone } from '@/lib/format';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const phone = searchParams.get('phone');
    const stage = searchParams.get('stage');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const supabase = createSupabaseServerClient();
    let query = supabase.from('customers').select('*').limit(limit).range(offset, offset + limit - 1);

    if (q) query = query.ilike('name', `%${q}%`);
    if (phone) query = query.eq('phone', normalizePhone(phone));
    if (stage) query = query.eq('current_stage', stage);

    const { data, error } = await query;
    if (error) throw error;
    
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
