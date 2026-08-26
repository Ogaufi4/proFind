import { useEffect, useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Field, PrimaryButton, inputStyle } from '@/components/ui';
import { FormScreen } from '@/components/form-screen';
import { useAuth } from '@/context/auth-context';
import { completeAuthRedirect } from '@/lib/auth-redirect';
export default function ResetPassword() { const { updatePassword }=useAuth(); const [password,setPassword]=useState(''); useEffect(()=>{void completeAuthRedirect();},[]); const submit=async()=>{if(password.length<10)return Alert.alert('Password too short','Use at least 10 characters.'); const result=await updatePassword(password); if(result.error)Alert.alert('Unable to reset',result.error);else{Alert.alert('Password updated');router.replace('/account');}}; return <FormScreen title="Choose a new password" body="Use a unique password of at least 10 characters."><Field label="New password"><TextInput style={inputStyle} value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" /></Field><PrimaryButton onPress={submit}>Update password</PrimaryButton></FormScreen>; }
