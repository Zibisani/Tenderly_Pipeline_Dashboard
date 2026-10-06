import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { unauthorized, err } from '@/lib/api-response';
import { writeAuditLog } from '@/lib/audit';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const stage = searchParams.get('stage');

    const supabase = createSupabaseServerClient();
    let query = supabase.from('customers').select('*');
    if (stage) query = query.eq('current_stage', stage);

    const { data, error } = await query;
    if (error) throw error;

    await writeAuditLog(supabase, user.id, user.email || '', 'export', undefined, undefined, { format, stage });

    if (format === 'csv') {
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map((row: any) => Object.values(row).map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(','));
      const csv = [headers, ...rows].join('\n');
      
      return new NextResponse(csv, {
        headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="customers_export.csv"' }
      });
    }

    return new NextResponse(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="customers_export.json"' }
    });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
