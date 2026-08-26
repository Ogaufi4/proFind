import { properties } from '@/data/properties';
import type { Property, PropertyFilters, SearchCriteria, SortOption } from '@/types';

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
