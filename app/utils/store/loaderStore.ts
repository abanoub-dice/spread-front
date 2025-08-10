import { create } from 'zustand';

interface LoaderState {
  isLoading: boolean;
}

interface LoaderActions {
  showLoader: () => void;
  hideLoader: () => void;
}

type LoaderStore = LoaderState & LoaderActions;

export const useLoaderStore = create<LoaderStore>((set) => ({
  isLoading: false,

  showLoader: () => {
    set({ isLoading: true });
  },

  hideLoader: () => {
    set({ isLoading: false });
  },
}));
