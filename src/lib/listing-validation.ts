import type { Property } from '@/types';

export type ListingDraft = Pick<Property, 'title' | 'mode' | 'type' | 'price' | 'suburb' | 'city' | 'province' | 'address' | 'latitude' | 'longitude' | 'description'> & Property['features'];
export const validateListing = (value: ListingDraft) => {
  const errors: Record<string, string> = {};
  if (value.title.trim().length < 10 || value.title.length > 120) errors.title = 'Use 10–120 characters.';
  if (!['buy', 'rent', 'commercial'].includes(value.mode)) errors.mode = 'Choose a listing type.';
  if (!value.type.trim()) errors.type = 'Enter a property type.';
  if (!Number.isFinite(value.price) || value.price < 1 || value.price > 1_000_000_000) errors.price = 'Enter a valid price.';
  for (const field of ['suburb', 'city', 'province', 'address'] as const) if (!value[field].trim()) errors[field] = 'Required.';
  if (value.description.trim().length < 30 || value.description.length > 5000) errors.description = 'Use 30–5,000 characters.';
  if (value.latitude < -90 || value.latitude > 90) errors.latitude = 'Invalid latitude.';
  if (value.longitude < -180 || value.longitude > 180) errors.longitude = 'Invalid longitude.';
  for (const field of ['bedrooms', 'bathrooms', 'garages', 'floorSize'] as const) if (!Number.isInteger(value[field]) || value[field] < 0) errors[field] = 'Enter zero or more.';
  return errors;
};
