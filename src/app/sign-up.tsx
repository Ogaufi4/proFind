import { useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Field, PrimaryButton, inputStyle } from '@/components/ui';
import { FormScreen } from '@/components/form-screen';
import { useAuth } from '@/context/auth-context';

export default function SignUpScreen() {
  const { signUp, configured } = useAuth(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async () => { if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || password.length < 10) return Alert.alert('Check your details', 'Use your name, a valid email, and a password of at least 10 characters.'); if (!configured) return Alert.alert('Setup required', 'Add Supabase values to your local environment.'); setBusy(true); const result = await signUp(name, email, password); setBusy(false); if (result.error) Alert.alert('Registration unsuccessful', result.error); else { Alert.alert('Confirm your email', 'Open the verification email before signing in.'); router.replace('/sign-in'); } };
  return <FormScreen title="Create your account" body="Your email must be confirmed before account features are enabled."><Field label="Full name"><TextInput style={inputStyle} value={name} onChangeText={setName} autoComplete="name" /></Field><Field label="Email"><TextInput style={inputStyle} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" /></Field><Field label="Password (10+ characters)"><TextInput style={inputStyle} value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" /></Field><PrimaryButton disabled={busy} onPress={submit}>{busy ? 'Creating…' : 'Create account'}</PrimaryButton></FormScreen>;
}
