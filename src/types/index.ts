import type { ImageSourcePropType } from 'react-native';

export type TransactionMode = 'buy' | 'rent' | 'commercial';
export type SortOption = 'relevance' | 'newest' | 'price-asc' | 'price-desc';
export type UserRole = 'member' | 'owner' | 'agent' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'deleted';
export type ListingStatus = 'draft' | 'published' | 'suspended' | 'archived';
export type ReportReason = 'fraud' | 'duplicate' | 'incorrect' | 'unavailable' | 'abuse' | 'other';
export interface VerificationState { emailVerified: boolean; phoneVerified: boolean }
export interface UserProfile { id: string; displayName: string; role: UserRole; status: AccountStatus; phone?: string; verification: VerificationState }
export interface PublisherProfile { userId: string; kind: 'owner' | 'agent'; agency?: string; ppraFfcNumber?: string; bio?: string }
export interface AuthState { userId: string; email?: string; profile: UserProfile | null; verification: VerificationState }
export interface PropertyImage { id: string; source: ImageSourcePropType; alt: string }
export interface PropertyFeature { bedrooms: number; bathrooms: number; garages: number; floorSize: number }
export interface Amenity { id: string; label: string }
export interface Agent { id: string; name: string; agency: string; phone: string; whatsapp: string; email: string; areas: string[] }
export interface Property {
  id: string; title: string; mode: TransactionMode; type: string; price: number; priceSuffix?: string;
  suburb: string; city: string; province: string; address: string; latitude: number; longitude: number;
  featured: boolean; commercial?: boolean; createdAt: string; images: PropertyImage[];
  features: PropertyFeature; amenities: Amenity[]; description: string; agentId: string;
  status?: ListingStatus; publisherId?: string;
}
export interface SearchCriteria { query: string; mode: TransactionMode; propertyType?: string }
export interface PropertyFilters { minPrice?: number; maxPrice?: number; bedrooms?: number; bathrooms?: number; garages?: number; minFloorSize?: number; amenities: string[] }
export interface ValuationRequest { id: string; name: string; email: string; phone: string; address: string; propertyType: string; bedrooms: number; bathrooms: number; notes?: string; createdAt: string }
export interface Enquiry { id: string; propertyId: string; name: string; email: string; phone?: string; message: string; createdAt: string }
