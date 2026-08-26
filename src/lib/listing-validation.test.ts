import { validateListing, type ListingDraft } from './listing-validation';
const valid: ListingDraft = { title: 'Secure family property', mode: 'buy', type: 'House', price: 2_000_000, suburb: 'Sandton', city: 'Johannesburg', province: 'Gauteng', address: '1 Main Road', latitude: -26.1, longitude: 28.1, description: 'A detailed and accurate description of this family property.', bedrooms: 3, bathrooms: 2, garages: 1, floorSize: 180 };
describe('listing validation', () => {
  test('accepts a bounded valid listing', () => expect(validateListing(valid)).toEqual({}));
  test('rejects unsafe bounds and incomplete content', () => {
    const errors = validateListing({ ...valid, title: 'short', price: -1, latitude: 100, bedrooms: -1, description: 'tiny' });
    expect(errors).toMatchObject({ title: expect.any(String), price: expect.any(String), latitude: expect.any(String), bedrooms: expect.any(String), description: expect.any(String) });
  });
});
