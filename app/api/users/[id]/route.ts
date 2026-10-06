import { requireCOO, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { createClient } from '@supabase/supabase-js';
import { writeAuditLog } from '@/lib/audit';

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user } = await requireCOO();
    const { name, role } = await request.json();
    const adminAuthClient = getAdminClient().auth.admin;
    
    const { data, error } = await adminAuthClient.updateUserById(id, {
      user_metadata: { name },
      app_metadata: { role }
    });
    if (error) throw error;

    const supabase = await createSupabaseServerClient();
    await writeAuditLog(supabase, user.id, user.email || '', 'user_updated', 'users', id, { name, role });

    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user } = await requireCOO();
    const adminAuthClient = getAdminClient().auth.admin;
    
    const { data, error } = await adminAuthClient.updateUserById(id, { ban_duration: '87600h' });
    if (error) throw error;

    const supabase = await createSupabaseServerClient();
    await writeAuditLog(supabase, user.id, user.email || '', 'user_disabled', 'users', id);

    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
