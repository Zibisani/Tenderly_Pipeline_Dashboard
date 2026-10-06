import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const stage = searchParams.get('stage');

    const supabase = await createSupabaseServerClient();
    let query = supabase.from('customers').select('*');

    if (q) {
      query = query.or(`name.ilike.%${q}%,phone_normalised.ilike.%${q}%`);
    }
    if (stage) {
      query = query.eq('current_stage', parseInt(stage, 10));
    }

    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;

    return ok(data || []);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
