import { create } from 'zustand';
import type { AppUser, ClientUser, DicerUser } from '../interfaces/user';
import { UserRole, UserType } from '../interfaces/user';
import { getCurrentUser } from '../api/authApis';

// Mock data for development
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

interface UserState {
  authenticated: boolean;
  user: AppUser | null;
  isLoading: boolean;
}

interface UserActions {
  setUser: (user: AppUser, token: string) => void;
  resetUser: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  authenticated: false,
  user: null,
  isLoading: false,

  setUser: (user: AppUser, token: string) => {
    set({
      authenticated: true,
      user,
    });
    localStorage.setItem('token', JSON.stringify(token));
  },

  resetUser: () => {
    set({
      authenticated: false,
      user: null,
    });
    localStorage.removeItem('token');
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      
      // const user = await getCurrentUser();
      const user = dicerUser; // Using mock data for now
      set({
        authenticated: true,
        user,
        isLoading: false,
      });
    } catch (error) {
      set({
        authenticated: false,
        user: null,
        isLoading: false,
      });
      localStorage.removeItem('token');
    }
  },
}));
