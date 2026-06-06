"use client";

import DashboardPage from "./(app)/dashboard/page";
import { useEffect } from "react";

// Types
// import { Goal, TabType, Task } from "./types/types";

import { useAppStore } from "./store/useAppStore";
import KanbanBoard from "./(app)/kanban-board/page";
import ScratchPad from "./(app)/scratchpad/page";
import FocusPage from "./(app)/focus-space/page";
import GoalsTracker from "./(app)/goals-tracker/page";
import Analytics from "./(app)/analytics/page";
import GithubPage from "./(app)/Github/page";
import Calendar from "./(app)/calendar/page";
import Achievements from "./(app)/achievements/page";

export default function Page() {
  // const tasks = useAppStore((state) => state.tasks);
  // const goals = useAppStore((state) => state.goals);
  // const xpPoints = useAppStore((state) => state.xpPoints);
  // const streakDays = useAppStore((state) => state.streakDays);
  // const setGoals = useAppStore((state) => state.setGoals);
  // const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  // const handleNavigateTab = (tab: TabType) => {
  //   setCurrentTab(tab);
  // };
  const minutes = useAppStore((state) => state.minutes);
  const seconds = useAppStore((state) => state.seconds);
  const pomodoroMode = useAppStore((state) => state.pomodoroMode);
  // const setPomodoroMode = useAppStore((state) => state.setPomodoroMode);
  const isTimerActive = useAppStore((state) => state.isTimerActive);

  // const toggleTimer = useAppStore((state) => state.toggleTimer);
  const stopTimer = useAppStore((state) => state.stopTimer);
  const resetTimer = useAppStore((state) => state.resetTimer);
  const setMinutes = useAppStore((state) => state.setMinutes);
  const setSeconds = useAppStore((state) => state.setSeconds);
  const addXP = useAppStore((state) => state.addXP);
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((s) => s - 1);
        return;
      }

      if (minutes > 0) {
        setMinutes((m: number) => m - 1);
        setSeconds(59);
        return;
      }

      stopTimer();

      addXP(pomodoroMode === "focus" ? 150 : 50);

      resetTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isTimerActive,
    minutes,
    seconds,
    pomodoroMode,
    setMinutes,
    setSeconds,
    stopTimer,
    addXP,
    resetTimer,
  ]);

  return (
    <>
      <DashboardPage />
      <KanbanBoard />
      <FocusPage />
      <ScratchPad />
      <GoalsTracker />
      <Analytics />
      <GithubPage />
      <Calendar />
      <Achievements />
    </>
  );
}

// const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
// const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

// const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
// const [activityEvents, setActivityEvents] =
//   useState<GitHubActivity[]>(MOCK_GITHUB_EVENTS);

// // Notifications summary indicators popup
// const [showNotificationCenter, setShowNotificationCenter] = useState(false);
// const [unreadNotifications, setUnreadNotifications] = useState([
//   {
//     id: "not-1",
//     msg: "Alex Rivera deployed nextjs-prod to production",
//     type: "system",
//     time: "12m ago",
//   },
//   {
//     id: "not-2",
//     msg: "MFA architecture token needs cryptographic audit",
//     type: "warning",
//     time: "1h ago",
//   },
// ]);

// Monitor total XP score to trigger level progression alerts
// useEffect(() => {
//   const calculatedLevel = Math.floor(xpPoints / 1000) + 1;
//   if (calculatedLevel > userLevel) {
//     setUserLevel(calculatedLevel);
//     alert(
//       `🚀 Congratulations! You leveled up to Level ${calculatedLevel}! Kept on shipping!`,
//     );
//   }
// }, [xpPoints, userLevel]);

// Register Cmd+K, Ctrl+K commands palette global key listener shortcut
// useEffect(() => {
//   const handleGlobalShortcuts = (e: KeyboardEvent) => {
//     if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//       e.preventDefault();
//       setIsCommandPaletteOpen((prev) => !prev);
//     }
//   };
//   window.addEventListener("keydown", handleGlobalShortcuts);
//   return () => window.removeEventListener("keydown", handleGlobalShortcuts);
// }, []);

// Set default Pomodoro duration based on mode selection parameters
// useEffect(() => {
//   if (pomodoroMode === "focus") {
//     setMinutes(25);
//   } else if (pomodoroMode === "short_break") {
//     setMinutes(5);
//   } else if (pomodoroMode === "long_break") {
//     setMinutes(15);
//   }
//   setSeconds(0);
// }, [pomodoroMode]);

// Claim Daily Streaks XP Lootbox package handler callback
// const handleClaimDailyStreakReward = () => {
//   setXpPoints((p) => p + 100);
//   setStreakDays((s) => s + 1);
// };
