import { GoogleSheetsAdapter, SheetsSyncResult, ConsultationSheetRow, MembershipSheetRow } from '../../types/integrations';
const MOCK_CONSULTATIONS: ConsultationSheetRow[] = [
  { cl_id: 'cl_1', name: 'Lesego Mokobi', phone: '71234567', consult_date: new Date(Date.now() + 86400000).toISOString(), ticket_status: 'Confirmed', outcome: '', quote_value: '' }
];
const MOCK_MEMBERSHIPS: MembershipSheetRow[] = [
  { tm_id: 'tm_1', name: 'Masego Molefe', phone: '76789012', tier: 'Gold', monthly_amount: '500', kit_price: '2000', billing_day: '1', payments_made: '3', balance: '0', status: 'active' },
];
export class MockGoogleSheetsAdapter implements GoogleSheetsAdapter {
  async getConsultations(): Promise<SheetsSyncResult<ConsultationSheetRow>> { return { data: MOCK_CONSULTATIONS, issues: [] }; }
  async getMemberships(): Promise<SheetsSyncResult<MembershipSheetRow>> { return { data: MOCK_MEMBERSHIPS, issues: [] }; }
}
export function getSheetsAdapter(): GoogleSheetsAdapter { return new MockGoogleSheetsAdapter(); }
