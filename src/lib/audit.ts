import { SupabaseClient } from '@supabase/supabase-js';

export async function writeAuditLog(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    user_email: userEmail,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata,
  });
}
