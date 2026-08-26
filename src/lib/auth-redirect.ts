import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

export async function completeAuthRedirect() {
  const url = await Linking.getInitialURL();
  if (!url) return;
  const parsed = new URL(url.replace('#', '?'));
  const code = parsed.searchParams.get('code');
  if (code) { await supabase.auth.exchangeCodeForSession(code); return; }
  const accessToken = parsed.searchParams.get('access_token'); const refreshToken = parsed.searchParams.get('refresh_token');
  if (accessToken && refreshToken) await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
}
