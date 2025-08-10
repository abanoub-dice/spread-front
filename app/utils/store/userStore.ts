import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '../interfaces/user';
import { getCurrentUser } from '../api/authApis';

// --- Store Types ---
interface UserState {
  authenticated: boolean;
  user: AppUser | null;
  token: string | null;
  isLoading: boolean;
}

interface UserActions {
  setUser: (user: AppUser, token: string) => void;
  resetUser: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

type UserStore = UserState & UserActions;

// --- Store ---
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      authenticated: false,
      user: null,
      token: null,
      isLoading: false,

      setUser: (user, token) => {
        set({ authenticated: true, user, token });
      },

      resetUser: () => {
        set({ authenticated: false, user: null, token: null });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      checkAuth: async () => {
        set({ isLoading: true });

        const token = get().token;
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const user = await getCurrentUser(); // real API
          set({ authenticated: true, user, isLoading: false });
        } catch {
          set({ authenticated: false, user: null, token: null, isLoading: false });
        }
      },
    }),
    {
      name: 'token', // localStorage key
      partialize: (state) => ({ token: state.token }), // store ONLY the token
    }
  )
);
