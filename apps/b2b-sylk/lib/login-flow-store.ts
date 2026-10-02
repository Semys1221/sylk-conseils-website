import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginFlowStore {
  loadingComplete: boolean;
  setLoadingComplete: (value: boolean) => void;
}

export const useLoginFlowStore = create<LoginFlowStore>()(
  persist(
    (set) => ({
      loadingComplete: false,
      setLoadingComplete: (value) => set({ loadingComplete: value }),
    }),
    {
      name: "sylk-login-flow",
      partialize: (state) => ({
        loadingComplete: state.loadingComplete,
      }),
    }
  )
);
