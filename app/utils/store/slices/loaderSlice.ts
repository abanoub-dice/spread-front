import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface LoaderState {
  isLoading: boolean;
}

const initialState: LoaderState = {
  isLoading: false,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader: state => {
      state.isLoading = true;
    },
    hideLoader: state => {
      state.isLoading = false;
    }
  },
});

export const getLoader = (state: RootState) => state.loader;

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
