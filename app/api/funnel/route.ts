import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function GET() {
  try {
    await requireAuth();
    const supabase = createSupabaseServerClient();
    // ASSUMPTION: customers table exists with current_stage, total_spend, days_in_stage
    const { data: funnelData, error } = await supabase.from('customers').select('current_stage, total_spend, days_in_stage');
    if (error) throw error;
    
    return ok({ message: "Funnel overview data", data: funnelData });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
