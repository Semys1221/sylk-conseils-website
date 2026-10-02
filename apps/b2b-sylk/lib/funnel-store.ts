import { create } from "zustand";

interface FunnelOverlayState {
  onClose: (() => void) | null;
  setOnClose: (fn: (() => void) | null) => void;
}

export const useFunnelOverlayStore = create<FunnelOverlayState>((set) => ({
  onClose: null,
  setOnClose: (fn) => set({ onClose: fn }),
}));
