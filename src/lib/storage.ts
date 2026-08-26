import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Enquiry, SearchCriteria, ValuationRequest } from '@/types';

const keys = { favorites: 'propfind:favorites', searches: 'propfind:recent-searches', valuations: 'propfind:valuations', enquiries: 'propfind:enquiries', onboarding: 'propfind:onboarding-complete' } as const;
const read = async <T>(key: string, fallback: T): Promise<T> => {
  try { const value = await AsyncStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};
const write = async <T>(key: string, value: T) => AsyncStorage.setItem(key, JSON.stringify(value));

export const storage = {
  onboardingComplete: async () => (await AsyncStorage.getItem(keys.onboarding)) === 'true',
  completeOnboarding: () => AsyncStorage.setItem(keys.onboarding, 'true'),
  favorites: () => read<string[]>(keys.favorites, []),
  setFavorites: (ids: string[]) => write(keys.favorites, ids),
  recentSearches: () => read<SearchCriteria[]>(keys.searches, []),
  saveSearch: async (search: SearchCriteria) => { const current = await read<SearchCriteria[]>(keys.searches, []); await write(keys.searches, [search, ...current].slice(0, 8)); },
  saveValuation: async (item: ValuationRequest) => { const current = await read<ValuationRequest[]>(keys.valuations, []); await write(keys.valuations, [item, ...current]); },
  saveEnquiry: async (item: Enquiry) => { const current = await read<Enquiry[]>(keys.enquiries, []); await write(keys.enquiries, [item, ...current]); },
};
