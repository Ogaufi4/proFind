import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Bath, BedDouble, CarFront, Heart, MapPin, Maximize } from 'lucide-react-native';
import { Badge } from '@/components/ui';
import { useApp } from '@/context/app-context';
import { formatPrice } from '@/lib/property-repository';
import { colors, fonts } from '@/theme/tokens';
import type { Property } from '@/types';

export function PropertyCard({ property }: { property: Property }) {
  const { favorites, toggleFavorite } = useApp();
  const saved = favorites.includes(property.id);
  return <Pressable accessibilityRole="button" accessibilityLabel={`View ${property.title}`} onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })} style={styles.card}>
    <View style={styles.imageWrap}>
      <Image source={property.images[0].source} contentFit="cover" style={styles.image} accessibilityLabel={property.images[0].alt} transition={180} />
      <View style={styles.badges}><Badge tone={property.commercial ? 'purple' : 'blue'}>{property.commercial ? 'Commercial' : property.mode === 'rent' ? 'For rent' : 'For sale'}</Badge>{property.featured && <Badge tone="amber">Featured</Badge>}</View>
      <Pressable accessibilityLabel={saved ? 'Remove from favorites' : 'Save property'} onPress={(event) => { event.stopPropagation(); toggleFavorite(property.id); }} style={styles.favorite}><Heart size={25} color={colors.white} fill={saved ? colors.white : 'transparent'} /></Pressable>
    </View>
    <View style={styles.details}>
      <Text style={styles.price}>{formatPrice(property)}</Text>
      <Text numberOfLines={1} style={styles.title}>{property.title}</Text>
      <View style={styles.location}><MapPin size={20} color={colors.slate} /><Text numberOfLines={1} style={styles.locationText}>{property.suburb}, {property.city}</Text></View>
      <View style={styles.rule} />
      <View style={styles.features}>
        {property.features.bedrooms > 0 && <Feature icon={<BedDouble />} value={property.features.bedrooms} />}
        <Feature icon={<Bath />} value={property.features.bathrooms} />
        <Feature icon={<CarFront />} value={property.features.garages} />
        <Feature icon={<Maximize />} value={`${property.features.floorSize.toLocaleString('en-ZA')} m²`} />
      </View>
    </View>
  </Pressable>;
}

function Feature({ icon, value }: { icon: React.ReactElement; value: string | number }) {
  return <View style={styles.feature}>{icon && <View>{icon}</View>}<Text style={styles.featureText}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 28, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  imageWrap: { height: 300, position: 'relative' }, image: { width: '100%', height: '100%' },
  badges: { position: 'absolute', top: 20, left: 18, gap: 8 }, favorite: { position: 'absolute', top: 20, right: 18, width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(8,14,34,.42)', alignItems: 'center', justifyContent: 'center' },
  details: { padding: 24 }, price: { fontFamily: fonts.bold, color: colors.blue, fontSize: 28, letterSpacing: .3 }, title: { marginTop: 7, fontFamily: fonts.semibold, color: colors.ink, fontSize: 17 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 11 }, locationText: { flex: 1, color: colors.slate, fontFamily: fonts.regular, fontSize: 15 }, rule: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
  features: { flexDirection: 'row', alignItems: 'center', gap: 18, flexWrap: 'wrap' }, feature: { flexDirection: 'row', alignItems: 'center', gap: 7 }, featureText: { fontFamily: fonts.regular, color: colors.ink, fontSize: 14 },
});
