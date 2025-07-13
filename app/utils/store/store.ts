import { configureStore } from '@reduxjs/toolkit';
import dialogueReducer from './slices/dialogueSlice';
import loaderReducer from './slices/loaderSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    dialogue: dialogueReducer,
    loader: loaderReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;