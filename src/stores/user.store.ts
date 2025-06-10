import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '../api/auth/auth.responses';

interface UserStore {
  user: Omit<LoginResponse, 'accessToken'> | null;
  setUser: (user: Omit<LoginResponse, 'accessToken'>) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),
      removeUser: () => set({ user: null }),
    }),
    {
      name: 'user',
    }
  )
);
