import { useUserStore } from './userStore';
import { useDialogueStore } from './dialogueStore';
import { useLoaderStore } from './loaderStore';

// Zustand store hooks
export { useUserStore };
export { useDialogueStore };
export { useLoaderStore };

// Convenience selectors for user store
export const useUser = () => useUserStore(state => state.user);
export const useAuthenticated = () => useUserStore(state => state.authenticated);
export const useUserLoading = () => useUserStore(state => state.isLoading);

// Convenience selectors for dialogue store
export const useDialogue = () => useDialogueStore(state => state.data);

// Convenience selectors for loader store
export const useLoader = () => useLoaderStore(state => state.isLoading);
