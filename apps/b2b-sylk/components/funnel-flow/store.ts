import { create } from "zustand";

export type FlowStep = "welcome" | "calendly" | "qualification";

interface FlowState {
  step: FlowStep;
  answers: Record<string, string>;
  eventUri: string | null;
  inviteeUri: string | null;
  setStep: (step: FlowStep) => void;
  advance: () => void;
  answerQuestion: (key: string, value: string) => void;
  setCalendlyEvent: (eventUri: string, inviteeUri: string) => void;
  reset: () => void;
}

const order: FlowStep[] = ["welcome", "calendly", "qualification"];

export const useFlowStore = create<FlowState>((set, get) => ({
  step: "welcome",
  answers: {},
  eventUri: null,
  inviteeUri: null,

  setStep: (step) => set({ step }),

  advance: () => {
    const { step } = get();
    const idx = order.indexOf(step);
    if (idx < order.length - 1) set({ step: order[idx + 1] });
  },

  answerQuestion: (key: string, value: string) => {
    const { answers } = get();
    set({ answers: { ...answers, [key]: value } });
  },

  setCalendlyEvent: (eventUri, inviteeUri) => set({ eventUri, inviteeUri }),

  reset: () => set({ step: "welcome", answers: {}, eventUri: null, inviteeUri: null }),
}));
