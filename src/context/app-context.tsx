import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { storage } from '@/lib/storage';
import type { PropertyFilters, SearchCriteria, SortOption } from '@/types';
import { useAuth } from '@/context/auth-context';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const defaultSearch: SearchCriteria = { query: '', mode: 'buy' };
const defaultFilters: PropertyFilters = { amenities: [] };
interface AppState {
  search: SearchCriteria; setSearch: (value: SearchCriteria) => void;
  filters: PropertyFilters; setFilters: (value: PropertyFilters) => void;
  sort: SortOption; setSort: (value: SortOption) => void;
  favorites: string[]; toggleFavorite: (id: string) => void; ready: boolean;
}
const AppContext = createContext<AppState | null>(null);
export function AppProvider({ children }: PropsWithChildren) {
  const { auth } = useAuth();
  const [search, setSearch] = useState(defaultSearch);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (auth && isSupabaseConfigured) void (async () => { const { data } = await supabase.from('favorites').select('listing_id').eq('user_id', auth.userId); setFavorites((data || []).map((row) => row.listing_id)); setReady(true); })();
    else storage.favorites().then(setFavorites).finally(() => setReady(true));
  }, [auth]);
  const toggleFavorite = (id: string) => setFavorites((current) => {
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    if (auth && isSupabaseConfigured) {
      if (current.includes(id)) void supabase.from('favorites').delete().eq('user_id', auth.userId).eq('listing_id', id);
      else void supabase.from('favorites').insert({ user_id: auth.userId, listing_id: id });
    } else void storage.setFavorites(next);
    return next;
  });
  const value = { search, setSearch, filters, setFilters, sort, setSort, favorites, toggleFavorite, ready };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used within AppProvider'); return value; }
