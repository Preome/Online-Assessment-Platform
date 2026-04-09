import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
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
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;