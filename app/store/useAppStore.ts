// import { create } from "zustand";
// import { PomodoroMode, TabType } from "../types/types";

import { create } from "zustand";
import { Goal, PomodoroMode, TabType, Task } from "../types/types";

import { INITIAL_TASKS } from "../data/mockData";
import { MOCK_GOALS } from "../data/mockData";

type AppStore = {
  // ==================================
  // Sidebar
  // ==================================
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;

  // ==================================
  // Dashboard
  // ==================================
  streakDays: number;
  xpPoints: number;
  userLevel: number;

  addXP: (amount: number) => void;
  addStreak: (amount: number) => void;

  // ==================================
  // Tasks
  // ==================================
  tasks: Task[];
  // setTasks: (updater: (prev: Task[]) => Task[]) => void;
  setTasks: (tasks: Task[]) => void;
  toggleTaskCompletion: (taskId: string) => void;

  // ==================================
  // Goals
  // ==================================
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;

  // ==================================
  // Pomodoro
  // ==================================
  pomodoroMode: PomodoroMode;
  minutes: number;
  seconds: number;
  isTimerActive: boolean;

  setPomodoroMode: (mode: PomodoroMode) => void;

  setMinutes: (value: number | ((prev: number) => number)) => void;
  setSeconds: (value: number | ((prev: number) => number)) => void;

  toggleTimer: () => void;
  stopTimer: () => void;

  resetTimer: () => void;
};

const getInitialMinutes = (mode: PomodoroMode) => {
  switch (mode) {
    case "focus":
      return 25;

    case "short_break":
      return 5;

    case "long_break":
      return 15;

    default:
      return 25;
  }
};

export const useAppStore = create<AppStore>((set, get) => ({
  // ==================================
  // Sidebar
  // ==================================
  currentTab: "dashboard",

  setCurrentTab: (tab) =>
    set({
      currentTab: tab,
    }),

  // ==================================
  // Dashboard
  // ==================================
  streakDays: 12,
  xpPoints: 3450,
  userLevel: 4,

  addXP: (amount) =>
    set((state) => ({
      xpPoints: state.xpPoints + amount,
    })),

  addStreak: (amount) =>
    set((state) => ({
      streakDays: state.streakDays + amount,
    })),

  // ==================================
  // Tasks
  // ==================================
  tasks: INITIAL_TASKS,

  setTasks: (tasks) =>
    set({
      tasks,
    }),

  toggleTaskCompletion: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "todo" : "completed",
            }
          : task,
      ),

      xpPoints: state.xpPoints + 100,
    })),

  // ==================================
  // Goals
  // ==================================
  goals: MOCK_GOALS,

  setGoals: (goals) =>
    set({
      goals,
    }),

  // ==================================
  // Pomodoro
  // ==================================
  pomodoroMode: "focus",

  minutes: 25,

  seconds: 0,

  isTimerActive: false,

  setPomodoroMode: (mode) =>
    set({
      pomodoroMode: mode,
      minutes: getInitialMinutes(mode),
      seconds: 0,
    }),

  setMinutes: (value) =>
    set((state) => ({
      minutes: typeof value === "function" ? value(state.minutes) : value,
    })),

  setSeconds: (value) =>
    set((state) => ({
      seconds: typeof value === "function" ? value(state.seconds) : value,
    })),

  toggleTimer: () =>
    set((state) => ({
      isTimerActive: !state.isTimerActive,
    })),

  stopTimer: () =>
    set({
      isTimerActive: false,
    }),

  resetTimer: () => {
    const mode = get().pomodoroMode;

    set({
      isTimerActive: false,
      minutes: getInitialMinutes(mode),
      seconds: 0,
    });
  },
}));
