import type { ValuationRequest } from '@/types';

export type ValuationForm = Omit<ValuationRequest, 'id' | 'createdAt' | 'bedrooms' | 'bathrooms'> & { bedrooms: string; bathrooms: string };
export const validateValuation = (form: ValuationForm) => {
  const errors: Partial<Record<keyof ValuationForm, string>> = {};
  if (!form.name.trim()) errors.name = 'Enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (form.phone.replace(/\D/g, '').length < 9) errors.phone = 'Enter a valid phone number.';
  if (!form.address.trim()) errors.address = 'Enter the property address.';
  if (!form.propertyType.trim()) errors.propertyType = 'Enter the property type.';
  return errors;
};
