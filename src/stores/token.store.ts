import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TokenStore {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      token: null,

      setToken: (token) => set({ token }),
      removeToken: () => set({ token: null }),
    }),
    {
      name: 'token',
    }
  )
);
