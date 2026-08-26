import { validateValuation } from '@/lib/valuation-validation';

describe('valuation validation', () => {
  it('requires contact and property details', () => { expect(Object.keys(validateValuation({ name: '', email: 'bad', phone: '1', address: '', propertyType: '', bedrooms: '', bathrooms: '', notes: '' }))).toHaveLength(5); });
  it('accepts a complete request', () => { expect(validateValuation({ name: 'Neo Molefe', email: 'neo@example.com', phone: '0821234567', address: '1 Main Road', propertyType: 'House', bedrooms: '3', bathrooms: '2', notes: '' })).toEqual({}); });
});
