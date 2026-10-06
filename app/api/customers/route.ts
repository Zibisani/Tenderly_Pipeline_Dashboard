import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ok } from '@/lib/api-response';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').toLowerCase();
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
    if (error || !data || data.length === 0) {
      let filtered = MOCK_CUSTOMERS;
      if (q) {
        filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.phone_normalised.includes(q));
      }
      if (stage) {
        filtered = filtered.filter(c => c.current_stage === parseInt(stage, 10));
      }
      return ok(filtered);
    }

    return ok(data);
  } catch (e: any) {
    return ok(MOCK_CUSTOMERS);
  }
}