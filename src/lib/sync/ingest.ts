import { DataSource } from '../../types/domain';
export interface IngestResult { customersProcessed: number; newCustomers: number; stageChanges: number; alertsRaised: number; matchReviewsCreated: number; dataQualityIssues: number; syncStatuses: Record<DataSource, 'ok' | 'failed'>; errors: string[]; }
export async function runIngest(supabase: any, options?: { sources?: DataSource[] }): Promise<IngestResult> {
  const result: IngestResult = { customersProcessed: 0, newCustomers: 0, stageChanges: 0, alertsRaised: 0, matchReviewsCreated: 0, dataQualityIssues: 0, syncStatuses: { consultation_sheet: 'ok', membership_sheet: 'ok', takeapp: 'ok' }, errors: [] };
  try {
    console.log('Running ingest pipeline...');
  } catch (error) {
    result.errors.push(String(error));
  }
  return result;
}
