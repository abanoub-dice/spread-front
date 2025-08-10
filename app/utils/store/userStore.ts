import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser, ClientUser, DicerUser } from '../interfaces/user';
import { UserRole, UserType } from '../interfaces/user';

// --- Mock Data ---
const dicerUser: DicerUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@dicema.com',
  type: UserType.DICER,
  created_at: '2025-04-14T14:12:34.000000Z',
  updated_at: '2025-04-24T13:11:29.000000Z',
  role: UserRole.ADMIN,
};

const clientUser: ClientUser = {
  id: 2,
  name: 'Sarah Johnson',
  email: 'amir.haroun@dicema.com',
  phone: '+15415190190',
  account_id: 1,
  deleted_at: null,
  created_at: '2025-04-14T14:12:34.000000Z',
  updated_at: '2025-04-24T13:11:29.000000Z',
  type: UserType.CLIENT,
};

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
          // const user = await getCurrentUser(); // real API
          const user = dicerUser; // mock for now
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
