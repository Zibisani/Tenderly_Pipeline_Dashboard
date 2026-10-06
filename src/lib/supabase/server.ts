import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type UserRole = 'coo' | 'ceo';
export interface User { id: string; email?: string; app_metadata: { role?: UserRole; [key: string]: any }; user_metadata: any }

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (error) {}
        },
      },
    }
  );
}

export async function requireAuth(): Promise<{ user: User; role: UserRole }> {
  const supabase = createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('UNAUTHORIZED');
  const role = user.app_metadata?.role as UserRole || 'ceo';
  return { user: user as unknown as User, role };
}

export async function requireCOO(): Promise<{ user: User; role: 'coo' }> {
  const { user, role } = await requireAuth();
  if (role !== 'coo') throw new Error('FORBIDDEN');
  return { user, role: 'coo' };
}
