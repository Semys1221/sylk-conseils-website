import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminView = "accueil" | "website" | "pipeline" | "rendez-vous" | "parametres";
export type SelectedUser = "stephane" | "yvan";

interface AdminStore {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;

  /** User selection */
  selectedUser: SelectedUser | null;
  setSelectedUser: (user: SelectedUser) => void;

  /** Onboarding */
  onboardingComplete: boolean;
  setOnboardingComplete: (value: boolean) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      activeView: "accueil",
      setActiveView: (view) => set({ activeView: view }),

      selectedUser: null,
      setSelectedUser: (user) => set({ selectedUser: user }),

      onboardingComplete: false,
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
    }),
    {
      name: "sylk-admin-store", // localStorage key
      partialize: (state) => ({
        selectedUser: state.selectedUser,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
