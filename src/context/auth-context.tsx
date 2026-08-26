import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AuthState, UserProfile, UserRole } from '@/types';

type Result = { error?: string };
interface AuthContextValue {
  session: Session | null; auth: AuthState | null; profile: UserProfile | null; loading: boolean; configured: boolean;
  signIn(email: string, password: string): Promise<Result>; signUp(name: string, email: string, password: string): Promise<Result>;
  requestPasswordReset(email: string): Promise<Result>; updatePassword(password: string): Promise<Result>; signOut(global?: boolean): Promise<void>;
  refreshProfile(): Promise<void>; sendPhoneOtp(phone: string): Promise<Result>; verifyPhoneOtp(phone: string, token: string): Promise<Result>;
  setupPublisher(role: Extract<UserRole, 'owner' | 'agent'>, agency?: string, ffc?: string): Promise<Result>;
}
const AuthContext = createContext<AuthContextValue | null>(null);
const safeMessage = 'We could not complete that request. Check your details and try again.';

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null); const [profile, setProfile] = useState<UserProfile | null>(null); const [loading, setLoading] = useState(isSupabaseConfigured);
  const refreshProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('id,display_name,role,status,phone,phone_verified_at').eq('id', user.id).maybeSingle();
    if (!data) { setProfile(null); return; }
    setProfile({ id: data.id, displayName: data.display_name, role: data.role, status: data.status, phone: data.phone || undefined, verification: { emailVerified: Boolean(user.email_confirmed_at), phoneVerified: Boolean(data.phone_verified_at) } });
  }, []);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); return refreshProfile(); }).finally(() => setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); queueMicrotask(() => void refreshProfile()); });
    return () => data.subscription.unsubscribe();
  }, [refreshProfile]);
  const signIn = async (email: string, password: string) => { const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password }); return error ? { error: safeMessage } : {}; };
  const signUp = async (displayName: string, email: string, password: string) => { const { error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { display_name: displayName.trim() }, emailRedirectTo: 'propfind://auth-callback' } }); return error ? { error: safeMessage } : {}; };
  const requestPasswordReset = async (email: string) => { const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: 'propfind://reset-password' }); return error ? { error: safeMessage } : {}; };
  const updatePassword = async (password: string) => { const { error } = await supabase.auth.updateUser({ password }); return error ? { error: safeMessage } : {}; };
  const signOut = async (global = false) => { await supabase.auth.signOut({ scope: global ? 'global' : 'local' }); setProfile(null); setSession(null); };
  const sendPhoneOtp = async (phone: string) => { const { error } = await supabase.auth.updateUser({ phone }); return error ? { error: safeMessage } : {}; };
  const verifyPhoneOtp = async (phone: string, token: string) => { const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'phone_change' }); if (error) return { error: safeMessage }; const { error: syncError } = await supabase.rpc('sync_phone_verification'); if (!syncError) await refreshProfile(); return syncError ? { error: safeMessage } : {}; };
  const setupPublisher = async (role: Extract<UserRole, 'owner' | 'agent'>, agency?: string, ffc?: string) => { const { error } = await supabase.rpc('setup_publisher', { requested_kind: role, requested_agency: agency || null, requested_ffc: ffc || null }); if (!error) await refreshProfile(); return error ? { error: safeMessage } : {}; };
  const auth = useMemo<AuthState | null>(() => session?.user ? { userId: session.user.id, email: session.user.email, profile, verification: profile?.verification || { emailVerified: Boolean(session.user.email_confirmed_at), phoneVerified: false } } : null, [session, profile]);
  const value = { session, auth, profile, loading, configured: isSupabaseConfigured, signIn, signUp, requestPasswordReset, updatePassword, signOut, refreshProfile, sendPhoneOtp, verifyPhoneOtp, setupPublisher };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; }
