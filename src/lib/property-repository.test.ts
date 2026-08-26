import { filterProperties, formatPrice } from './property-repository';
import { properties } from '@/data/properties';

describe('property repository', () => {
  it('formats South African property prices', () => { expect(formatPrice({ price: 1950000 })).toBe('R 1 950 000'); });
  it('searches location and filters bedrooms', () => { const result = filterProperties(properties, { query: 'Cape Town', mode: 'buy' }, { bedrooms: 5, amenities: [] }, 'relevance'); expect(result.map((item) => item.id)).toEqual(['clifton-luxury-villa']); });
  it('sorts prices from low to high', () => { const result = filterProperties(properties, { query: '', mode: 'buy' }, { amenities: [] }, 'price-asc'); expect(result[0].price).toBeLessThanOrEqual(result.at(-1)!.price); });
});
