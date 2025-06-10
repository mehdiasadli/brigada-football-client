import { create } from 'zustand';
import { type MatchSchema } from '../schemas/entities/match.entity';

interface MatchFiltersStore {
  status: MatchSchema['status'] | null;
  sortBy: 'createdAt' | 'startTime';
  sortDir: 'asc' | 'desc';

  setStatus: (status: MatchSchema['status'] | null) => void;
  setSortBy: (sortBy: 'createdAt' | 'startTime') => void;
  setSortDir: (sortDir: 'asc' | 'desc') => void;
}

export const useMatchFiltersStore = create<MatchFiltersStore>((set) => ({
  status: null,
  sortBy: 'createdAt',
  sortDir: 'desc',

  setStatus: (status: MatchSchema['status'] | null) => set({ status }),
  setSortBy: (sortBy: 'createdAt' | 'startTime') => set({ sortBy }),
  setSortDir: (sortDir: 'asc' | 'desc') => set({ sortDir }),
}));
