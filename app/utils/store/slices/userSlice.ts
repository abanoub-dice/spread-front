import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { AppUser, ClientUser, DicerUser } from '../../interfaces/user';
import { UserType } from '../../interfaces/user';
import { getCurrentUser } from '../../api/authApis';
import { showLoader, hideLoader } from './loaderSlice';

const dicerUser: DicerUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@dicema.com',
  role: UserType.DICER,
  created_at: '2025-04-14T14:12:34.000000Z',
  updated_at: '2025-04-24T13:11:29.000000Z',
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
  role: UserType.CLIENT,
};
interface UserState {
  data: {
    authenticated: boolean;
    user: AppUser | null;
  };
}

const initialState: UserState = {
  data: {
    authenticated: false,
    user: null,
  },
};

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showLoader());
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(hideLoader());
        return rejectWithValue('No token found');
      }
      // const user = await getCurrentUser();
      const user = clientUser;
      dispatch(hideLoader());
      return user;
    } catch (error) {
      dispatch(hideLoader());
      localStorage.removeItem('token');
      return rejectWithValue('Invalid token');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: AppUser; token: string }>) => {
      state.data = {
        authenticated: true,
        user: action.payload.user,
      };
      localStorage.setItem('token', JSON.stringify(action.payload.token));
    },
    resetUser: () => {
      localStorage.removeItem('token');
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.data = {
          authenticated: true,
          user: action.payload,
        };
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.data = {
          authenticated: false,
          user: null,
        };
        localStorage.removeItem('token');
      });
  },
});

export const getUser = (state: RootState) => state.user.data;

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
