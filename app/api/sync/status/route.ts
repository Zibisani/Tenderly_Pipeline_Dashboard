import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function GET() {
  try {
    await requireAuth();
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('sync_status').select('*');
    if (error) throw error;
    
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
