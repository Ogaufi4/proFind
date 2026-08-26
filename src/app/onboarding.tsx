import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Heart, MapPin, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo, PrimaryButton } from '@/components/ui';
import { storage } from '@/lib/storage';
import { colors, fonts } from '@/theme/tokens';

const { width } = Dimensions.get('window');
const slides = [
  { id: 'discover', image: require('../../assets/properties/hero-villa.png'), icon: Search, eyebrow: 'DISCOVER', title: 'Find a place that feels like home', body: 'Explore remarkable homes, apartments and commercial spaces across South Africa.' },
  { id: 'save', image: require('../../assets/properties/sandton-modern.png'), icon: Heart, eyebrow: 'SHORTLIST', title: 'Keep your favourites close', body: 'Save the properties you love and return to your shortlist whenever you are ready.' },
  { id: 'connect', image: require('../../assets/properties/constantia-villa.png'), icon: MapPin, eyebrow: 'CONNECT', title: 'Move forward with confidence', body: 'Contact trusted local agents, request a valuation and take the next step with ease.' },
] as const;

export default function OnboardingScreen() {
  const list = useRef<FlatList>(null); const [index, setIndex] = useState(0);
  const finish = async () => { await storage.completeOnboarding(); router.replace('/'); };
  const next = () => { if (index === slides.length - 1) void finish(); else list.current?.scrollToIndex({ index: index + 1, animated: true }); };
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => { if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index); }, []);
  return <SafeAreaView style={styles.root}>
    <View style={styles.top}><Logo /><Pressable accessibilityRole="button" onPress={() => void finish()} hitSlop={12}><Text style={styles.skip}>Skip</Text></Pressable></View>
    <FlatList ref={list} data={slides} horizontal pagingEnabled bounces={false} showsHorizontalScrollIndicator={false} keyExtractor={(item) => item.id} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={{ itemVisiblePercentThreshold: 60 }} renderItem={({ item }) => {
      const Icon = item.icon; return <View style={styles.slide}><View style={styles.imageWrap}><Image source={item.image} contentFit="cover" style={styles.image} /><View style={styles.icon}><Icon size={27} color={colors.white} /></View></View><Text style={styles.eyebrow}>{item.eyebrow}</Text><Text style={styles.title}>{item.title}</Text><Text style={styles.body}>{item.body}</Text></View>;
    }} />
    <View style={styles.bottom}><View style={styles.dots}>{slides.map((slide, dot) => <View key={slide.id} style={[styles.dot, dot === index && styles.dotActive]} />)}</View><PrimaryButton onPress={next}>{index === slides.length - 1 ? 'Get Started' : 'Continue'}</PrimaryButton><Text style={styles.legal}>By continuing, you agree to our Terms and Privacy Policy.</Text></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white }, top: { height: 92, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, skip: { color: colors.slate, fontFamily: fonts.semibold, fontSize: 15 },
  slide: { width, paddingHorizontal: 24, alignItems: 'center' }, imageWrap: { width: '100%', height: '52%', maxHeight: 420, minHeight: 300, borderRadius: 32, overflow: 'hidden', position: 'relative', backgroundColor: colors.softBlue }, image: { width: '100%', height: '100%' }, icon: { position: 'absolute', right: 20, bottom: 20, width: 58, height: 58, borderRadius: 20, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.blue, fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1.7, marginTop: 28 }, title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 30, lineHeight: 38, letterSpacing: -1.2, textAlign: 'center', marginTop: 9, maxWidth: 380 }, body: { color: colors.slate, fontFamily: fonts.regular, fontSize: 15, lineHeight: 24, textAlign: 'center', marginTop: 12, maxWidth: 360 },
  bottom: { paddingHorizontal: 24, paddingBottom: 14, gap: 14 }, dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 3 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border }, dotActive: { width: 28, backgroundColor: colors.blue }, legal: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, textAlign: 'center' },
});
