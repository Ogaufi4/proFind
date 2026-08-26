import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Field, PrimaryButton, inputStyle } from '@/components/ui';
import { FormScreen } from '@/components/form-screen';
import { useAuth } from '@/context/auth-context';
import { colors, fonts } from '@/theme/tokens';

export default function SignInScreen() {
  const { signIn, configured } = useAuth(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async () => { if (!configured) return Alert.alert('Setup required', 'Add Supabase values to your local environment.'); setBusy(true); const result = await signIn(email, password); setBusy(false); if (result.error) Alert.alert('Sign in unsuccessful', result.error); else router.replace('/account'); };
  return <FormScreen title="Welcome back" body="Sign in to save properties, contact publishers, and manage listings."><Field label="Email"><TextInput style={inputStyle} value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" /></Field><Field label="Password"><TextInput style={inputStyle} value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" /></Field><PrimaryButton disabled={busy} onPress={submit}>{busy ? 'Signing in…' : 'Sign in'}</PrimaryButton><Pressable onPress={() => router.push('/forgot-password')}><Text style={styles.link}>Forgot password?</Text></Pressable><Pressable onPress={() => router.push('/sign-up')}><Text style={styles.link}>Create an account</Text></Pressable></FormScreen>;
}
const styles = StyleSheet.create({ link: { color: colors.blue, fontFamily: fonts.semibold, textAlign: 'center', padding: 14 } });
