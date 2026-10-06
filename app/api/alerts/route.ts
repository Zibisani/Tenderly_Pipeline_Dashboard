import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ok } from '@/lib/api-response';
import { MOCK_ALERTS } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');

    const supabase = await createSupabaseServerClient();
    let query = supabase.from('alerts').select('*, milestones(*), customers(*)').eq('status', 'active');
    if (severity) query = query.eq('severity', severity);

    const { data, error } = await query.order('raised_at', { ascending: false });
    if (error || !data || data.length === 0) {
      const filtered = severity ? MOCK_ALERTS.filter(a => a.alert.severity === severity) : MOCK_ALERTS;
      return ok(filtered);
    }

    return ok(data);
  } catch (e: any) {
    return ok(MOCK_ALERTS);
  }
}