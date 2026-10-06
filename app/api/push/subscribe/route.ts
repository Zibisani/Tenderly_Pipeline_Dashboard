import { requireAuth, createSupabaseServerClient } from '@/lib/supabase/server';
import { ok, unauthorized, err } from '@/lib/api-response';

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth();
    const subscription = await request.json();

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh,
      auth: subscription.keys?.auth
    }).select().single();

    if (error) throw error;
    return ok(data);
  } catch (e: any) {
    if (e.message === 'UNAUTHORIZED') return unauthorized();
    return err(e.message, 500);
  }
}
