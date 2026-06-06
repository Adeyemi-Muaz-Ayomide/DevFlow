import { WEEKLY_ANALYTICS_DATA } from "@/app/data/mockData";
import { Goal, TabType, Task } from "@/app/types/types";
import {
  Activity,
  ArrowRight,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
  activeTasks: Task[];
  onToggleTask: (id: string) => void;
  dailyGoals: Goal[];
  pomodoroState: {
    minutes: number;
    seconds: number;
    isActive: boolean;
    onToggle: () => void;
    onReset: () => void;
    mode: "focus" | "short_break" | "long_break";
  };
  streakDays: number;
  xpPoints: number;
}

const MainContent = ({
  onNavigate,
  activeTasks,
  dailyGoals,
  onToggleTask,
  pomodoroState,
}: DashboardViewProps) => {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      id="dashboard-bento-grid"
    >
      {/* Left column spans 2 - Active Tasks and Focus Stats */}
      <div className="lg:col-span-2 space-y-6">
        {/* Active Work Tasks */}
        <div className="bg-card-dark border border-card-border rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-card-border bg-[#050507] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold text-gray-200">
                Active Sprint Tasks Quickview
              </span>
            </div>
            <button
              onClick={() => onNavigate("kanban")}
              className="text-[10px] text-accent-purple hover:text-purple-400 font-mono flex items-center gap-1 cursor-pointer"
            >
              Go to Kanban Board <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-card-border/60">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500 font-mono">
                No active tasks in progress. Enjoy focus time!
              </div>
            ) : (
              activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-neutral-900/30 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[8px] uppercase px-1.5 py-0.5 rounded-sm font-mono border ${
                          task.priority === "urgent"
                            ? "bg-rose-950/20 text-rose-400 border-rose-900/30"
                            : task.priority === "high"
                              ? "bg-amber-950/20 text-amber-400 border-amber-900/30"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {task.dueDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-sans font-medium text-gray-200 truncate pr-4">
                      {task.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="px-2.5 py-1 text-[10px] bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-white rounded-md hover:bg-neutral-800 transition-colors font-mono cursor-pointer shrink-0"
                  >
                    Complete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Overviews with Chart */}
        <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-1">
                <Activity className="w-4 h-4 text-purple-400" /> Coding
                Productivity Metrics
              </h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Lines of code vs Commit intensity
              </p>
            </div>
            <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-gray-400 px-2 py-0.5 rounded-sm font-mono">
              Current Sprint Week
            </span>
          </div>

          {/* Recharts Area Container */}
          <div className="h-48 w-full" id="weekly-overview-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={WEEKLY_ANALYTICS_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorLines" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0c",
                    border: "1px solid #16161a",
                    color: "#f4f4f5",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="codingLines"
                  name="Lines Written"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorLines)"
                />
                <Area
                  type="monotone"
                  dataKey="commits"
                  name="Commits Registered"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorCommits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right column spans 1 - Today's Goals, Mini Focus Timer */}
      <div className="space-y-6">
        {/* Today's Goals Widget */}
        <div className="bg-card-dark border border-card-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-gray-200 flex items-center justify-between">
            <span>Today&apos;s Tracked Goals</span>
            <span className="text-[10px] font-mono font-medium text-gray-500">
              Daily Alignment
            </span>
          </h3>

          <div className="space-y-3">
            {dailyGoals.map((goal) => {
              const completionPercentage = Math.round(
                (goal.progress / goal.total) * 100,
              );
              return (
                <div
                  key={goal.id}
                  className="p-3 bg-neutral-900/40 border border-neutral-800/60 rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-300 font-sans font-medium line-clamp-1">
                      {goal.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 rounded-sm shrink-0 border ${
                        goal.status === "completed"
                          ? "text-green-400 bg-green-950/20 border-green-905"
                          : "text-amber-400 bg-amber-950/20 border-amber-900/30"
                      }`}
                    >
                      {completionPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.status === "completed"
                          ? "bg-green-500"
                          : "bg-accent-purple"
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => onNavigate("goals")}
            className="w-full py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-gray-300 hover:text-white rounded-lg transition-colors text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Manage Milestone Goals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Focus Session Core Mini Widget Widget */}
        <div
          className="bg-card-dark border border-card-border rounded-xl p-4 space-y-4 relative overflow-hidden"
          id="dashboard-focus-session-widget"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-200 flex items-center gap-2">
              <Timer className="w-4 h-4 text-accent-purple" /> Focus Session
              Widget
            </span>
            <span className="text-[10px] bg-purple-950/40 border border-purple-900/40 text-accent-purple px-2 py-0.5 rounded-xs font-mono">
              {pomodoroState.mode === "focus" ? "Work Block" : "Relax Break"}
            </span>
          </div>

          <div className="bg-[#030304]/60 boundary-inner border border-card-border p-4 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
            <h2 className="text-3xl font-mono font-bold text-white tracking-widest leading-none">
              {String(pomodoroState.minutes).padStart(2, "0")}:
              {String(pomodoroState.seconds).padStart(2, "0")}
            </h2>
            <p className="text-[10px] text-gray-500 font-sans">
              Keep building distraction free. Active focus score is{" "}
              <span className="text-accent-blue font-semibold">92%</span>.
            </p>

            <div className="flex items-center gap-2 pt-1.5">
              <button
                onClick={pomodoroState.onToggle}
                className="p-2 bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                title={
                  pomodoroState.isActive
                    ? "Pause Focus Loop"
                    : "Launch Focus Block"
                }
              >
                {pomodoroState.isActive ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 text-green-400" />
                )}
              </button>
              <button
                onClick={pomodoroState.onReset}
                className="p-2 bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("focus")}
                className="px-3.5 py-1.5 bg-accent-purple/20 hover:bg-accent-purple/30 text-accent-purple border border-purple-900/30 hover:border-purple-800/40 rounded-md text-xs font-mono transition-colors cursor-pointer"
              >
                Go Full Workspace →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
