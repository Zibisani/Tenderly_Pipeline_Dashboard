import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, notFound, err } from '@/lib/api-response';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAuth();
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('customers')
      .select('*, consultations(*), orders(*), memberships(*), stage_history(*), source_links(*), alerts(*)')
      .eq('id', id)
      .single();

    if (error || !data) return notFound();
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
