import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { AuthUser } from '../../interfaces/user';
import { getCurrentUser } from '../../api/authApis';
import { showLoader, hideLoader } from './loaderSlice';

interface UserState {
  data: {
    authenticated: boolean;
    user: AuthUser | null;
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
      const user = await getCurrentUser();
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
    setUser: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
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
