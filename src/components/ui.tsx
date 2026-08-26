import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, type PressableProps, type TextInputProps } from 'react-native';
import { Search, Menu, X, Heart, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, shadow } from '@/theme/tokens';

export function Logo({ light = false }: { light?: boolean }) {
  return <View style={styles.logoWrap}><View style={[styles.logoMark, light && styles.logoMarkLight]}><Search size={28} color={light ? colors.blue : colors.white} strokeWidth={2} /></View><Text style={[styles.logoText, light && { color: colors.white }]}>PropFind</Text></View>;
}

const menuSections: [string, string[]][] = [
  ['Properties', ['Property for Sale', 'Property to Rent', 'Commercial Property', 'New Developments']],
  ['Professionals', ['Find an Estate Agent', 'Agency Directory', 'Sell Your Property', 'Agent Portal Login']],
  ['Company', ['About Us', 'Contact Us', 'Terms & Conditions', 'Privacy Policy']],
];

export function Header({ back = false, transparent = false }: { back?: boolean; transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  return <>
    <SafeAreaView edges={['top']} style={[styles.header, transparent && styles.headerTransparent]}>
      <View style={styles.headerInner}>
        {back ? <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.headerBack}><ArrowLeft color={transparent ? colors.white : colors.ink} size={28} /></Pressable> : <Logo light={transparent} />}
        <Pressable accessibilityLabel="Open navigation menu" onPress={() => setOpen(true)} hitSlop={12}><Menu size={34} color={transparent ? colors.white : colors.ink} /></Pressable>
      </View>
    </SafeAreaView>
    <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
      <SafeAreaView style={styles.menuSheet}>
        <View style={styles.menuTop}><Logo /><Pressable accessibilityLabel="Close navigation menu" onPress={() => setOpen(false)}><X size={32} color={colors.ink} /></Pressable></View>
        <ScrollView contentContainerStyle={styles.menuContent}>
          <Pressable onPress={() => { setOpen(false); router.push('/favorites'); }} style={styles.favoriteMenu}><Heart color={colors.blue} /><Text style={styles.favoriteMenuText}>Saved properties</Text></Pressable>
          {menuSections.map(([heading, links]) => <View key={heading} style={styles.menuSection}><Text style={styles.menuHeading}>{heading}</Text>{(links as string[]).map((link) => <Pressable key={link} onPress={() => {
            setOpen(false);
            if (link === 'Find an Estate Agent') router.push('/agents');
            else if (link === 'Sell Your Property') router.push('/valuation');
            else if (link.includes('Sale') || link.includes('Rent') || link.includes('Commercial')) router.push('/results');
          }}><Text style={styles.menuLink}>{link}</Text></Pressable>)}</View>)}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  </>;
}

export function Badge({ children, tone = 'blue' }: PropsWithChildren<{ tone?: 'blue' | 'amber' | 'purple' | 'soft' }>) {
  return <View style={[styles.badge, { backgroundColor: tone === 'amber' ? colors.amber : tone === 'purple' ? colors.purple : tone === 'soft' ? colors.softBlue : colors.blue }]}><Text style={[styles.badgeText, tone === 'soft' && { color: colors.slate }]}>{children}</Text></View>;
}

export function PrimaryButton({ children, variant = 'blue', icon, ...props }: PropsWithChildren<PressableProps & { variant?: 'blue' | 'white' | 'outline' | 'green' | 'dark'; icon?: ReactNode }>) {
  const backgroundColor = variant === 'white' || variant === 'outline' ? colors.white : variant === 'green' ? colors.green : variant === 'dark' ? colors.ink : colors.blue;
  const foreground = variant === 'white' || variant === 'outline' ? colors.blue : colors.white;
  return <Pressable accessibilityRole="button" {...props} style={(state) => [styles.primaryButton, { backgroundColor, borderColor: variant === 'outline' ? colors.blue : backgroundColor, opacity: state.pressed ? .86 : 1 }, typeof props.style === 'function' ? props.style(state) : props.style]}>{icon}<Text style={[styles.primaryButtonText, { color: foreground }]}>{children}</Text></Pressable>;
}

export function Field({ label, error, children }: PropsWithChildren<{ label: string; error?: string }>) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text>{children}{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <View style={styles.empty}><Search size={46} color={colors.blue} /><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text>{action}</View>;
}

export const inputStyle: TextInputProps['style'] = { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16, minHeight: 54, paddingHorizontal: 16, color: colors.ink, fontFamily: fonts.regular, fontSize: 15 };

const styles = StyleSheet.create({
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, zIndex: 20, ...shadow },
  headerTransparent: { backgroundColor: 'transparent', borderBottomWidth: 0, shadowOpacity: 0, elevation: 0 },
  headerInner: { minHeight: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  headerBack: { width: 60, height: 60, justifyContent: 'center' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoMark: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  logoMarkLight: { backgroundColor: colors.white },
  logoText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 28, letterSpacing: -1.1 },
  menuSheet: { flex: 1, backgroundColor: colors.canvas }, menuTop: { paddingHorizontal: 24, minHeight: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuContent: { padding: 24, paddingBottom: 60 }, favoriteMenu: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 18, backgroundColor: colors.white, borderRadius: 18 }, favoriteMenuText: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 17 },
  menuSection: { marginTop: 34, gap: 16 }, menuHeading: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 21, marginBottom: 4 }, menuLink: { color: colors.slate, fontFamily: fonts.regular, fontSize: 16 },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 17, paddingVertical: 8, ...shadow }, badgeText: { color: colors.white, fontFamily: fonts.bold, fontSize: 13, textTransform: 'uppercase', letterSpacing: .3 },
  primaryButton: { minHeight: 58, borderRadius: 20, borderWidth: 2, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }, primaryButtonText: { fontFamily: fonts.semibold, fontSize: 17 },
  field: { gap: 8, marginBottom: 18 }, fieldLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink }, error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 12 },
  empty: { alignItems: 'center', padding: 40, gap: 12 }, emptyTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.ink, textAlign: 'center' }, emptyBody: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 24, color: colors.slate, textAlign: 'center', marginBottom: 10 },
});
