import { canManageListing, canPublish, isPublicListing } from './security';
import type { UserProfile } from '@/types';
const profile = (overrides: Partial<UserProfile> = {}): UserProfile => ({ id: 'one', displayName: 'User', role: 'owner', status: 'active', verification: { emailVerified: true, phoneVerified: true }, ...overrides });
describe('security helpers', () => {
  test('publication needs a publisher role, active account, and both contacts', () => {
    expect(canPublish(profile())).toBe(true);
    expect(canPublish(profile({ role: 'member' }))).toBe(false);
    expect(canPublish(profile({ status: 'suspended' }))).toBe(false);
    expect(canPublish(profile({ verification: { emailVerified: true, phoneVerified: false } }))).toBe(false);
  });
  test('listing management is limited to owner or active admin', () => {
    expect(canManageListing(profile(), 'one')).toBe(true);
    expect(canManageListing(profile(), 'two')).toBe(false);
    expect(canManageListing(profile({ role: 'admin' }), 'two')).toBe(true);
  });
  test('only published or legacy demo listings are public', () => {
    expect(isPublicListing('published')).toBe(true); expect(isPublicListing()).toBe(true); expect(isPublicListing('draft')).toBe(false);
  });
});
