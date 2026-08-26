import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Page } from '@/components/page';
import { EmptyState, PrimaryButton } from '@/components/ui';
import { PropertyCard } from '@/components/property-card';
import { useApp } from '@/context/app-context';
import { propertyRepository } from '@/lib/property-repository';
import { useEffect, useState } from 'react';
import type { Property } from '@/types';
import { colors, fonts } from '@/theme/tokens';
import { useAuth } from '@/context/auth-context';

export default function FavoritesScreen() { const { auth }=useAuth(); const { favorites, ready } = useApp(); const [items,setItems]=useState<Property[]>([]); useEffect(()=>{if(auth)void propertyRepository.all().then(all=>setItems(all.filter(item=>favorites.includes(item.id))))},[auth,favorites]); if(!auth)return <Page back><EmptyState title="Sign in required" body="Saved properties are tied to your secure account." action={<PrimaryButton onPress={()=>router.replace('/sign-in')}>Sign in</PrimaryButton>}/></Page>; return <Page back><Text style={styles.title}>Saved Properties</Text><Text style={styles.body}>Keep your favourite homes together and revisit them anytime.</Text>{ready && !items.length ? <EmptyState title="Nothing saved yet" body="Tap the heart on any property to save it here." action={<PrimaryButton onPress={() => router.push('/results')}>Browse properties</PrimaryButton>} /> : <View style={styles.list}>{items.map((item) => <PropertyCard key={item.id} property={item} />)}</View>}</Page>; }
const styles = StyleSheet.create({ title: { fontFamily: fonts.bold, color: colors.ink, fontSize: 30 }, body: { fontFamily: fonts.regular, color: colors.slate, lineHeight: 24, marginTop: 6, marginBottom: 28 }, list: { gap: 26 } });
