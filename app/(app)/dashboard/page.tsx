"use client";
import { WEEKLY_ANALYTICS_DATA } from "@/app/data/mockData";
import { useAppStore } from "@/app/store/useAppStore";

import {
  Activity,
  CheckCircle,
  Flame,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";

import { motion } from "motion/react";
import MainContent from "./maincontent";
import { useEffect } from "react";

const DashboardPage = () => {
  // const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const tasks = useAppStore((state) => state.tasks);
  const goals = useAppStore((state) => state.goals);
  const xpPoints = useAppStore((state) => state.xpPoints);
  const streakDays = useAppStore((state) => state.streakDays);
  const setTasks = useAppStore((state) => state.setTasks);
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  // const handleNavigateTab = (tab: TabType) => {
  //   setCurrentTab(tab);
  // };
  const minutes = useAppStore((state) => state.minutes);
  const seconds = useAppStore((state) => state.seconds);
  const pomodoroMode = useAppStore((state) => state.pomodoroMode);
  const isTimerActive = useAppStore((state) => state.isTimerActive);

  const toggleTimer = useAppStore((state) => state.toggleTimer);
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

  const pendingTasksCount = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "backlog",
  ).length;

  // Calculate aggregate focus hours
  const focusHoursTotal = WEEKLY_ANALYTICS_DATA.reduce(
    (acc, curr) => acc + curr.focusHours,
    0,
  ).toFixed(1);

  // Filter down to the daily goals
  const dailyGoals = goals.filter((g) => g.category === "daily");

  // Get active developer tasks
  const activeTasks = tasks
    .filter((t) => t.status === "in_progress" || t.status === "todo")
    .slice(0, 3);

  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "completed" ? "todo" : "completed",
            }
          : t,
      ),
    );

    addXP(100);
  };

  return (
    <div className="my-6 mx-8">
      <div
        className=" mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-linear-to-r from-neutral-900/60 via-card-border/30 to-card-dark border border-card-border rounded-xl glow-card"
        id="welcome-section"
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-accent-purple text-xs font-mono font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Center Live</span>
          </div>
          <h1 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight">
            Welcome back, adeyemimuaz1
          </h1>
          <p className="text-xs text-gray-400">
            Current cluster node is operating at{" "}
            <span className="text-green-400 font-mono">100% capacity</span>. You
            have{" "}
            <span className="text-white font-semibold">
              {pendingTasksCount} tickets pending
            </span>{" "}
            in your active sprint.
          </p>
        </div>

        {/* Level & Streak summary card */}
        <div className="flex items-center gap-4 bg-neutral-900/80 p-3 rounded-lg border border-neutral-800/80 max-w-fit shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-950/40 text-accent-purple border border-purple-900/40 rounded-md">
              <Flame className="w-4 h-4 breathing" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                Streak
              </p>
              <p className="text-xs font-bold text-gray-200">
                {streakDays} Days
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-950/40 text-accent-blue border border-blue-900/40 rounded-md">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                Score
              </p>
              <p className="text-xs font-bold text-gray-200">{xpPoints} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* B. Quick Stats Row */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        id="quick-stats-row"
      >
        {[
          {
            title: "Velocity completed",
            val: `${completedTasks} Tasks`,
            label: "Target +15 this cycle",
            icon: CheckCircle,
            color: "text-green-400 bg-green-500/5 border-green-500/10",
          },
          {
            title: "Focus Deep Hours",
            val: `${focusHoursTotal} Hrs`,
            label: "Weekly activity trend",
            icon: Timer,
            color: "text-accent-purple bg-purple-500/5 border-purple-500/10",
          },
          {
            title: "Streak Counter",
            val: `${streakDays} Days`,
            label: "Rank: Senior Auditor",
            icon: Flame,
            color: "text-amber-500 bg-amber-500/5 border-amber-500/10",
          },
          {
            title: "Metric Progress",
            val: "88.4%",
            label: "3 of 4 Daily Goals",
            icon: Activity,
            color: "text-accent-blue bg-blue-500/5 border-blue-500/10",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="p-4 bg-card-dark border border-card-border rounded-xl space-y-3 shadow-xs relative overflow-hidden"
              id={`stat-card-${idx}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                  {item.title}
                </span>
                <span className={`p-1.5 rounded-md border ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {item.val}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ............................................ */}
      <MainContent
        onNavigate={setCurrentTab}
        activeTasks={activeTasks}
        dailyGoals={dailyGoals}
        onToggleTask={handleToggleTaskCompletion}
        pomodoroState={{
          minutes,
          seconds,
          isActive: isTimerActive,
          onToggle: toggleTimer,
          onReset: resetTimer,
          mode: pomodoroMode,
        }}
        streakDays={streakDays}
        xpPoints={xpPoints}
      />
    </div>
  );
};

export default DashboardPage;
