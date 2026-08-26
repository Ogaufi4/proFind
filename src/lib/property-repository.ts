import { properties } from '@/data/properties';
import type { Property, PropertyFilters, SearchCriteria, SortOption } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface PropertyRepository {
  all(): Promise<Property[]>;
  byId(id: string): Promise<Property | undefined>;
  search(criteria: SearchCriteria, filters: PropertyFilters, sort: SortOption): Promise<Property[]>;
}

export const formatPrice = (property: Pick<Property, 'price' | 'priceSuffix'>) => {
  const value = `R ${new Intl.NumberFormat('en-ZA').format(property.price).replace(/\u00a0/g, ' ')}`;
  return property.priceSuffix ? `${value} ${property.priceSuffix}` : value;
};

export const filterProperties = (items: Property[], criteria: SearchCriteria, filters: PropertyFilters, sort: SortOption) => {
  const query = criteria.query.trim().toLowerCase();
  const filtered = items.filter((property) => {
    const searchable = [property.title, property.suburb, property.city, property.province, property.type].join(' ').toLowerCase();
    return property.mode === criteria.mode
      && (!query || searchable.includes(query))
      && (!criteria.propertyType || property.type.toLowerCase() === criteria.propertyType.toLowerCase())
      && (filters.minPrice == null || property.price >= filters.minPrice)
      && (filters.maxPrice == null || property.price <= filters.maxPrice)
      && (filters.bedrooms == null || property.features.bedrooms >= filters.bedrooms)
      && (filters.bathrooms == null || property.features.bathrooms >= filters.bathrooms)
      && (filters.garages == null || property.features.garages >= filters.garages)
      && (filters.minFloorSize == null || property.features.floorSize >= filters.minFloorSize)
      && filters.amenities.every((id) => property.amenities.some((amenity) => amenity.label === id));
  });
  return [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'newest') return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    return Number(b.featured) - Number(a.featured);
  });
};

export const localPropertyRepository: PropertyRepository = {
  async all() { return properties; },
  async byId(id) { return properties.find((property) => property.id === id); },
  async search(criteria, filters, sort) { return filterProperties(properties, criteria, filters, sort); },
};

type ListingRow = {
  id: string; title: string; mode: Property['mode']; property_type: string; price: number; price_suffix: string | null;
  suburb: string; city: string; province: string; address: string; latitude: number | null; longitude: number | null;
  featured: boolean; created_at: string; description: string; publisher_id: string; status: Property['status'];
  bedrooms: number; bathrooms: number; garages: number; floor_size: number; amenities: string[] | null;
  listing_images?: { id: string; storage_path: string; alt_text: string; position: number; signed_url?: string }[];
};
const rowToProperty = (row: ListingRow): Property => ({
  id: row.id, title: row.title, mode: row.mode, type: row.property_type, price: Number(row.price), priceSuffix: row.price_suffix || undefined,
  suburb: row.suburb, city: row.city, province: row.province, address: row.address, latitude: Number(row.latitude || 0), longitude: Number(row.longitude || 0),
  featured: row.featured, createdAt: row.created_at, description: row.description, agentId: row.publisher_id, publisherId: row.publisher_id, status: row.status,
  features: { bedrooms: row.bedrooms, bathrooms: row.bathrooms, garages: row.garages, floorSize: row.floor_size },
  amenities: (row.amenities || []).map((label, index) => ({ id: `${index}-${label}`, label })),
  images: (row.listing_images || []).length ? (row.listing_images || []).sort((a, b) => a.position - b.position).map((image) => ({ id: image.id, source: { uri: image.signed_url }, alt: image.alt_text })) : [{ id: 'placeholder', source: require('../../assets/properties/hero-villa.png'), alt: 'Property image pending' }],
});
const attachImages = async (rows: ListingRow[]) => {
  if (!rows.length) return rows;
  const { data } = await supabase.from('listing_images').select('id,listing_id,storage_path,alt_text,position').in('listing_id', rows.map((row) => row.id));
  const images = data || []; const { data: signed } = await supabase.storage.from('listing-images').createSignedUrls(images.map((image) => image.storage_path), 3600);
  const withUrls = images.map((image, index) => ({ ...image, signed_url: signed?.[index]?.signedUrl ?? undefined }));
  return rows.map((row) => ({ ...row, listing_images: withUrls.filter((image) => image.listing_id === row.id && image.signed_url) }));
};
export const supabasePropertyRepository: PropertyRepository = {
  async all() { const { data, error } = await supabase.from('published_listings').select('*'); if (error) throw error; return (await attachImages(data as ListingRow[])).map(rowToProperty); },
  async byId(id) { const { data, error } = await supabase.from('published_listings').select('*').eq('id', id).maybeSingle(); if (error) throw error; return data ? rowToProperty((await attachImages([data as ListingRow]))[0]) : undefined; },
  async search(criteria, filters, sort) { return filterProperties(await this.all(), criteria, filters, sort); },
};
export const propertyRepository = isSupabaseConfigured ? supabasePropertyRepository : localPropertyRepository;
