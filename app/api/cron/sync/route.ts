import { createClient } from '@supabase/supabase-js';

async function runIngest(supabase: any) {
  return { success: true, processed: 0 };
}

export async function GET(request: Request) {
  const secret = request.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  
  const result = await runIngest(supabase);
  return Response.json({ ok: true, result });
}
