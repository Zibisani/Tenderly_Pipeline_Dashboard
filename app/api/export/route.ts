import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { unauthorized, err } from '@/lib/api-response';

export async function GET() {
  try {
    await requireAuth();
    const supabase = await createSupabaseServerClient();

    const { data: customers } = await supabase.from('customers').select('*');
    const { data: orders } = await supabase.from('orders').select('*');
    const { data: memberships } = await supabase.from('memberships').select('*');

    const exportData = { customers: customers || [], orders: orders || [], memberships: memberships || [], exportedAt: new Date().toISOString() };
    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="tenderly-pipeline-export-${Date.now()}.json"`
      }
    });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
