// for storing the match data in the browser storage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateMatchSchema } from '../schemas/matches.schema';

interface CreateMatchStore {
  matchData: CreateMatchSchema | null;
  setMatchData: (matchData: CreateMatchSchema) => void;
  resetMatchData: () => void;
}

export const useCreateMatchStore = create<CreateMatchStore>()(
  persist(
    (set) => ({
      matchData: null,

      setMatchData: (matchData) => set({ matchData }),
      resetMatchData: () => set({ matchData: null }),
    }),
    { name: 'new-match' }
  )
);
