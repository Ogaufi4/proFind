import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { secureStorage } from '@/lib/secure-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const isSupabaseConfigured = Boolean(url && publishableKey);

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  publishableKey || 'placeholder-publishable-key',
  { auth: { storage: secureStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: Platform.OS === 'web' } },
);

if (Platform.OS !== 'web' && isSupabaseConfigured) {
  AppState.addEventListener('change', (state) => state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh());
}
