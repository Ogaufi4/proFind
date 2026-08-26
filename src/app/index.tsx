import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Building2, MapPin, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { Header, PrimaryButton } from '@/components/ui';
import { PropertyCard } from '@/components/property-card';
import { useApp } from '@/context/app-context';
import { properties } from '@/data/properties';
import { storage } from '@/lib/storage';
import { colors, fonts } from '@/theme/tokens';
import type { TransactionMode } from '@/types';

const hero = require('../../assets/properties/hero-villa.png');
const stats = [['32,000+', 'Active listings'], ['R 2.4m', 'Avg. sale price'], ['8,500+', 'Verified agents'], ['15 yrs', 'Market leaders']];

export default function HomeScreen() {
  const { search, setSearch } = useApp();
  const [typeOpen, setTypeOpen] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  useEffect(() => { storage.onboardingComplete().then((complete) => { if (!complete) router.replace('/onboarding'); else setOnboardingChecked(true); }); }, []);
  if (!onboardingChecked) return <View style={styles.root} />;
  const submit = () => { void storage.saveSearch(search); router.push('/results'); };
  return <ScrollView style={styles.root} contentContainerStyle={styles.scroll} stickyHeaderIndices={[]}>
    <ImageBackground source={hero} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
      <LinearGradient colors={['rgba(4,11,31,.85)', 'rgba(8,14,34,.45)', 'rgba(8,14,34,.7)']} style={StyleSheet.absoluteFill} />
      <Header transparent />
      <View style={styles.heroCopy}><Text style={styles.heroTitle}>Find your next{`\n`}perfect home.</Text><View style={styles.underline} /><Text style={styles.heroBody}>Search the most complete property portal in South Africa. We have exactly what you&apos;re looking for.</Text></View>
      <View style={styles.searchCard}>
        <View style={styles.tabs}>{(['buy', 'rent', 'commercial'] as TransactionMode[]).map((mode) => <Pressable key={mode} onPress={() => setSearch({ ...search, mode })} style={[styles.tab, search.mode === mode && styles.tabActive]}><Text style={[styles.tabText, search.mode === mode && styles.tabTextActive]}>{mode[0].toUpperCase() + mode.slice(1)}</Text></Pressable>)}</View>
        <View style={styles.searchRow}><MapPin color={colors.blue} size={25} /><TextInput accessibilityLabel="Search suburb, city or province" placeholder="Search suburb, city or province..." placeholderTextColor={colors.slate} value={search.query} onChangeText={(query) => setSearch({ ...search, query })} onSubmitEditing={submit} style={styles.searchInput} /></View>
        <Pressable onPress={() => setTypeOpen((value) => !value)} style={styles.searchRow}><Building2 color={colors.blue} size={25} /><Text style={[styles.searchInput, { paddingTop: 3 }]}>{search.propertyType || 'Property Type'}</Text></Pressable>
        {typeOpen && <View style={styles.typeOptions}>{['House', 'Apartment', 'Villa', 'Office'].map((type) => <Pressable key={type} onPress={() => { setSearch({ ...search, propertyType: type }); setTypeOpen(false); }}><Text style={styles.typeOption}>{type}</Text></Pressable>)}</View>}
        <PrimaryButton icon={<Search color={colors.white} size={24} />} onPress={submit}>Search</PrimaryButton>
      </View>
    </ImageBackground>
    <View style={styles.stats}>{stats.map(([value, label]) => <View key={label} style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>)}</View>
    <View style={styles.section}><Text style={styles.sectionTitle}>Featured Properties</Text><Text style={styles.sectionBody}>Hand-picked exclusive properties curated by our real estate experts.</Text><View style={styles.cardList}>{properties.filter((item) => item.featured).slice(0, 4).map((property) => <PropertyCard key={property.id} property={property} />)}</View><PrimaryButton variant="outline" onPress={() => router.push('/results')}>View all listings</PrimaryButton></View>
    <View style={styles.seller}><Text style={styles.sellerTitle}>Looking to sell your{`\n`}property?</Text><Text style={styles.sellerBody}>Connect with top-rated agents in your area and get the best price for your home.</Text><PrimaryButton variant="white" onPress={() => router.push('/agents')}>Find an Agent</PrimaryButton><PrimaryButton variant="outline" onPress={() => router.push('/valuation')}>Get Home Valuation</PrimaryButton></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas }, scroll: { paddingBottom: 0 }, hero: { minHeight: 850, paddingBottom: 18, justifyContent: 'space-between' }, heroImage: { resizeMode: 'cover' },
  heroCopy: { marginTop: 56, paddingHorizontal: 20 }, heroTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 46, lineHeight: 53, letterSpacing: -2.3 }, underline: { height: 6, backgroundColor: colors.blue, width: '88%', marginTop: 4 }, heroBody: { color: '#E3E7EF', fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, marginTop: 17 },
  searchCard: { backgroundColor: colors.white, borderRadius: 30, padding: 18, marginHorizontal: 18, gap: 8, borderBottomWidth: 10, borderBottomColor: '#DCE4FF' }, tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border }, tab: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' }, tabActive: { borderBottomColor: colors.blue }, tabText: { fontFamily: fonts.semibold, color: colors.slate, fontSize: 15 }, tabTextActive: { color: colors.blue },
  searchRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 12 }, searchInput: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 15 }, typeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 8 }, typeOption: { color: colors.blue, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, fontFamily: fonts.medium },
  stats: { backgroundColor: colors.white, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 34 }, stat: { width: '50%', alignItems: 'center', paddingVertical: 18, borderColor: colors.border, borderRightWidth: 1 }, statValue: { fontFamily: fonts.bold, color: colors.blue, fontSize: 30 }, statLabel: { fontFamily: fonts.medium, color: colors.slate, fontSize: 13, textTransform: 'uppercase' },
  section: { padding: 22, maxWidth: 760, width: '100%', alignSelf: 'center' }, sectionTitle: { marginTop: 42, fontFamily: fonts.bold, color: colors.ink, fontSize: 30, letterSpacing: -1.2 }, sectionBody: { fontFamily: fonts.regular, color: colors.slate, fontSize: 17, lineHeight: 27, marginTop: 10, marginBottom: 28 }, cardList: { gap: 28, marginBottom: 30 },
  seller: { padding: 34, paddingVertical: 75, backgroundColor: colors.blue, gap: 18 }, sellerTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 33, lineHeight: 42, textAlign: 'center' }, sellerBody: { color: '#F2F5FF', fontFamily: fonts.regular, fontSize: 18, lineHeight: 30, textAlign: 'center', marginBottom: 18 },
});
