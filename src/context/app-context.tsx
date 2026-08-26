import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { storage } from '@/lib/storage';
import type { PropertyFilters, SearchCriteria, SortOption } from '@/types';

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
  const [search, setSearch] = useState(defaultSearch);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { storage.favorites().then(setFavorites).finally(() => setReady(true)); }, []);
  const toggleFavorite = (id: string) => setFavorites((current) => {
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    void storage.setFavorites(next); return next;
  });
  const value = useMemo(() => ({ search, setSearch, filters, setFilters, sort, setSort, favorites, toggleFavorite, ready }), [search, filters, sort, favorites, ready]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used within AppProvider'); return value; }
