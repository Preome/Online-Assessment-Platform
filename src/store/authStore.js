import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const baseStore = (set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {
    // Mock authentication
    if (email === 'admin@akij.com' && password === 'password123') {
      set({ isAuthenticated: true, user: { email } });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
});

// Only apply `persist` on the client to avoid referencing localStorage/location during SSR
const useAuthStore = typeof window !== 'undefined'
  ? create(persist(baseStore, { name: 'auth-storage' }))
  : create(baseStore);

export default useAuthStore;