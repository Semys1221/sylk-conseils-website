import { create } from "zustand";

export type FlowStep = "welcome" | "intro" | "config" | "meeting";

interface FlowState {
  step: FlowStep;
  selectedMic: string;
  selectedCamera: string;
  devices: MediaDeviceInfo[];
  setStep: (step: FlowStep) => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
  selectMic: (id: string) => void;
  selectCamera: (id: string) => void;
  advance: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  step: "welcome",
  selectedMic: "",
  selectedCamera: "",
  devices: [],

  setStep: (step) => set({ step }),
  setDevices: (devices) => set({ devices }),
  selectMic: (id) => set({ selectedMic: id }),
  selectCamera: (id) => set({ selectedCamera: id }),

  advance: () => {
    const { step } = get();
    const order: FlowStep[] = ["welcome", "config", "intro", "meeting"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) set({ step: order[idx + 1] });
  },
}));
