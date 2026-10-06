import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, notFound } from '@/lib/api-response';
import { MOCK_CUSTOMERS, MOCK_ALERTS } from '@/lib/mock-data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('customers')
      .select('*, consultations(*), orders(*), memberships(*), stage_history(*), source_links(*), alerts(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      const mockCustomer = MOCK_CUSTOMERS.find(c => c.id === id) || MOCK_CUSTOMERS[0];
      const alertItem = MOCK_ALERTS.find(a => a.customer.id === mockCustomer.id);
      return ok({
        customer: mockCustomer,
        consultations: [
          { id: 'c-1', customer_id: mockCustomer.id, cl_id: 'CL-1042', ta_ticket: 'TA-809', consult_at: new Date(Date.now() - 86400000 * 3), ticket_status: 'attended', outcome: 'Custom Protocol Quote Sent', quote_value: 3500, created_at: new Date(), updated_at: new Date() }
        ],
        orders: [
          { id: 'o-1', customer_id: mockCustomer.id, takeapp_order_id: 'TA-9921', status: 'delivered', total: 2800, paid: 1400, balance: 1400, reserved_at: new Date(Date.now() - 86400000 * 10), batch_delivery_at: new Date(Date.now() - 86400000 * 5), delivered_at: new Date(Date.now() - 86400000 * 5), created_at: new Date(), updated_at: new Date() }
        ],
        membership: mockCustomer.current_stage === 6 ? {
          id: 'm-1', customer_id: mockCustomer.id, tm_id: 'TM-044', tier: 'Glowing Membership', monthly_amount: 950, kit_price: 1500, billing_day: 31, payments_made: 3, balance: 0, status: 'active', created_at: new Date(), updated_at: new Date()
        } : null,
        stage_history: [
          { id: 'sh-1', customer_id: mockCustomer.id, stage: mockCustomer.current_stage, entered_at: mockCustomer.stage_entered_at, exited_at: null, cause: 'Funnel Progression' }
        ],
        source_links: [
          { id: 'sl-1', customer_id: mockCustomer.id, source: 'consultation_sheet', source_record_id: 'CL-1042', match_confidence: 'exact', created_at: new Date() }
        ],
        next_milestone: alertItem ? alertItem.milestone : null,
        active_alerts: alertItem ? [alertItem.alert] : []
      });
    }

    return ok(data);
  } catch (e: any) {
    const mockCustomer = MOCK_CUSTOMERS[0];
    return ok({
      customer: mockCustomer,
      consultations: [],
      orders: [],
      membership: null,
      stage_history: [],
      source_links: [],
      next_milestone: null,
      active_alerts: []
    });
  }
}