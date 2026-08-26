import { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { FormScreen } from '@/components/form-screen';
import { colors } from '@/theme/tokens';
import { completeAuthRedirect } from '@/lib/auth-redirect';
export default function AuthCallback(){useEffect(()=>{void completeAuthRedirect().finally(()=>router.replace('/account'));},[]);return <FormScreen title="Confirming your account" body="This will only take a moment."><ActivityIndicator color={colors.blue}/><Text>Securely restoring your session…</Text></FormScreen>;}
