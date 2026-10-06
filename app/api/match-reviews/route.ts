import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';

export async function GET() {
  try {
    await requireCOO();
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('match_reviews').select('*, candidates:customers(*)').eq('status', 'pending');
    if (error) throw error;
    
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
