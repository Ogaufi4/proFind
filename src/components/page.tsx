import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { Header } from '@/components/ui';
import { colors } from '@/theme/tokens';

export function Page({ children, back, contentContainerStyle, ...props }: PropsWithChildren<ScrollViewProps & { back?: boolean }>) {
  return <View style={styles.root}><Header back={back} /><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, contentContainerStyle]} {...props}>{children}</ScrollView></View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.canvas }, content: { padding: 24, paddingBottom: 70, width: '100%', maxWidth: 760, alignSelf: 'center' } });
