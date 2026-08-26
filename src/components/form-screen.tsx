import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Page } from '@/components/page';
import { colors, fonts } from '@/theme/tokens';

export function FormScreen({ title, body, children }: PropsWithChildren<{ title: string; body: string }>) {
  return <Page back contentContainerStyle={styles.page}><Text style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text><View style={styles.form}>{children}</View></Page>;
}
const styles = StyleSheet.create({ page: { paddingTop: 34 }, title: { fontFamily: fonts.bold, color: colors.ink, fontSize: 32 }, body: { fontFamily: fonts.regular, color: colors.slate, lineHeight: 24, marginTop: 8 }, form: { marginTop: 28 } });
