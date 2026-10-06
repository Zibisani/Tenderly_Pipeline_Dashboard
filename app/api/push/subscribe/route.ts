import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth();
    const subscription = await request.json();
    
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      subscription_data: subscription,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
    if (error) throw error;

    return ok({ success: true });
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
