// app/stores/usePomodoroStore.ts
import { create } from "zustand";

type PomodoroMode = "work" | "short_break" | "long_break";

type PomodoroStore = {
  minutes: number;
  seconds: number;
  isActive: boolean;
  mode: PomodoroMode;
  setMode: (mode: PomodoroMode) => void;
  toggle: () => void;
  reset: () => void;
  tick: () => void;
};

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  work: 25,
  short_break: 5,
  long_break: 15,
};

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  minutes: 25,
  seconds: 0,
  isActive: false,
  mode: "work",

  setMode: (mode) =>
    set({ mode, minutes: MODE_DURATIONS[mode], seconds: 0, isActive: false }),

  toggle: () => set((state) => ({ isActive: !state.isActive })),

  reset: () =>
    set((state) => ({
      minutes: MODE_DURATIONS[state.mode],
      seconds: 0,
      isActive: false,
    })),

  tick: () =>
    set((state) => {
      if (state.seconds > 0) return { seconds: state.seconds - 1 };
      if (state.minutes > 0) return { minutes: state.minutes - 1, seconds: 59 };
      // Timer finished
      return {
        isActive: false,
        minutes: MODE_DURATIONS[state.mode],
        seconds: 0,
      };
    }),
}));
