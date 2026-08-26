import { useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { Field, PrimaryButton, inputStyle } from '@/components/ui';
import { FormScreen } from '@/components/form-screen';
import { useAuth } from '@/context/auth-context';
export default function ForgotPassword() { const { requestPasswordReset } = useAuth(); const [email,setEmail]=useState(''); const submit=async()=>{ await requestPasswordReset(email); Alert.alert('Check your email','If an account exists, a reset link has been sent.'); }; return <FormScreen title="Reset your password" body="For privacy, the response is the same whether or not an account exists."><Field label="Email"><TextInput style={inputStyle} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></Field><PrimaryButton onPress={submit}>Send reset link</PrimaryButton></FormScreen>; }
