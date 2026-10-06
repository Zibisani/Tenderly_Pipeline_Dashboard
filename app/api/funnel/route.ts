import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';
import { STAGE_LABELS, FunnelStage } from '@/types/domain';

export async function GET() {
  try {
    await requireAuth();
    const supabase = await createSupabaseServerClient();

    const { data: customers, error } = await supabase.from('customers').select('*');
    if (error) throw error;

    const stagesData = [1, 2, 3, 4, 5, 6, 7].map((s) => {
      const stageNum = s as FunnelStage;
      const stageCustomers = (customers || []).filter((c: any) => c.current_stage === stageNum);
      return {
        stage: stageNum,
        label: STAGE_LABELS[stageNum],
        customerCount: stageCustomers.length,
        cashReceived: stageCustomers.reduce((acc: number, c: any) => acc + Number(c.cash_received || 0), 0),
        cashCommitted: stageCustomers.reduce((acc: number, c: any) => acc + Number(c.cash_committed || 0), 0),
        cashExpected: stageCustomers.reduce((acc: number, c: any) => acc + Number(c.cash_expected || 0), 0),
        avgDaysInStage: 4,
        stuckCount: stageCustomers.filter((c: any) => c.status_flags?.includes('stuck')).length
      };
    });

    const { count: activeAlertCount } = await supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { data: syncStatuses } = await supabase.from('sync_status').select('*');

    return ok({
      stages: stagesData,
      activeAlertCount: activeAlertCount || 0,
      totalStuckCount: stagesData.reduce((acc, s) => acc + s.stuckCount, 0),
      syncStatuses: syncStatuses || [],
      lastUpdatedAt: new Date().toISOString()
    });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
