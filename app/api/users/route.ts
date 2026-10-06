import { requireCOO } from '@/lib/supabase/server';
import { ok, unauthorized, forbidden, err } from '@/lib/api-response';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function GET() {
  try {
    await requireCOO();
    const adminAuthClient = getAdminClient().auth.admin;
    const { data: { users }, error } = await adminAuthClient.listUsers();
    if (error) throw error;
    
    return ok(users.map(u => ({ id: u.id, email: u.email, role: u.app_metadata?.role })));
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireCOO();
    const { email, role } = await request.json();
    const adminAuthClient = getAdminClient().auth.admin;
    
    const { data, error } = await adminAuthClient.inviteUserByEmail(email, { data: { role } });
    if (error) throw error;

    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    if (e.message === 'FORBIDDEN') return forbidden();
    return err(e.message, 500);
  }
}
