import type { AccountStatus, ListingStatus, ReportReason, UserProfile, UserRole } from '@/types';

export const publisherRoles: UserRole[] = ['owner', 'agent'];
export const canPublish = (profile: UserProfile | null) => Boolean(profile && profile.status === 'active' && publisherRoles.includes(profile.role) && profile.verification.emailVerified && profile.verification.phoneVerified);
export const canManageListing = (profile: UserProfile | null, publisherId?: string) => Boolean(profile && profile.status === 'active' && (profile.role === 'admin' || profile.id === publisherId));
export const isPublicListing = (status?: ListingStatus) => !status || status === 'published';
export const accountStatuses: AccountStatus[] = ['active', 'suspended', 'deleted'];
export const reportReasons: { value: ReportReason; label: string }[] = [
  { value: 'fraud', label: 'Suspected fraud' }, { value: 'duplicate', label: 'Duplicate listing' },
  { value: 'incorrect', label: 'Incorrect information' }, { value: 'unavailable', label: 'No longer available' },
  { value: 'abuse', label: 'Abusive content' }, { value: 'other', label: 'Other' },
];
