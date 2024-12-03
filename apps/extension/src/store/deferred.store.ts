import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { useStore } from 'zustand';

interface TabState {
  isDeferred: boolean;
  setDeferredState: (state: boolean) => void;
}

const tabStore = createStore<TabState>()(
  persist(
    (set) => ({
      isDeferred: false,
      setDeferredState: (state: boolean) => set({ isDeferred: state }),
    }),
    {
      name: 'tab-store',
    },
  ),
);

export const useTabState = <T>(selector?: (state: TabState) => T) =>
  useStore(tabStore, selector!);
