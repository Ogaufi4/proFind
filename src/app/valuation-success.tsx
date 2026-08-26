import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { Page } from '@/components/page';
import { PrimaryButton } from '@/components/ui';
import { colors, fonts } from '@/theme/tokens';

export default function ValuationSuccess() { return <Page><View style={styles.wrap}><View style={styles.icon}><Check color={colors.white} size={42} strokeWidth={3} /></View><Text style={styles.title}>Request received</Text><Text style={styles.body}>Your valuation request has been saved. In a connected release, a local PropFind specialist would contact you next.</Text><PrimaryButton onPress={() => router.replace('/')}>Return home</PrimaryButton></View></Page>; }
const styles = StyleSheet.create({ wrap: { flex: 1, minHeight: 600, alignItems: 'center', justifyContent: 'center', gap: 18 }, icon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }, title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 29 }, body: { color: colors.slate, fontFamily: fonts.regular, textAlign: 'center', lineHeight: 25, marginBottom: 14 } });
