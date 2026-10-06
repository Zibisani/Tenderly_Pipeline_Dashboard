import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';

export async function GET() {
  try {
    await requireCOO();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from('data_quality').select('*').eq('resolved', false).order('created_at', { ascending: false });
    if (error) throw error;

    return ok(data || []);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
