"use client";
import React from "react";
import { motion } from "motion/react";
import { CircleDot, Trophy } from "lucide-react";
import { useAppStore } from "@/app/store/useAppStore";

const GoalsTracker = () => {
  // Categorise goals
  const goals = useAppStore((state) => state.goals);
  const dailyGoals = goals.filter((g) => g.category === "daily");
  const weeklyGoals = goals.filter((g) => g.category === "weekly");
  const monthlyGoals = goals.filter((g) => g.category === "monthly");
  const addXP = useAppStore((state) => state.addXP);
  const setGoals = useAppStore((state) => state.setGoals);

  // Handle mock incrementing progress of a goal ticket
  const handleIncrementProgress = (goalId: string) => {
    let gainedXP = 0;

    setGoals(
      goals.map((g) => {
        if (g.id !== goalId) return g;

        const nextProgress = Math.min(g.total, g.progress + 1);
        const justCompleted = nextProgress === g.total && g.progress < g.total;

        if (justCompleted && g.rewardXP) {
          gainedXP = g.rewardXP;
        } else if (nextProgress > g.progress) {
          gainedXP = 20;
        }

        return {
          ...g,
          progress: nextProgress,
          status: nextProgress === g.total ? "completed" : "on_track",
        };
      }),
    );

    if (gainedXP > 0) {
      addXP(gainedXP);

      alert(
        `Milestone progress recorded! Gained +${gainedXP} XP points. Keep shipping!`,
      );
    }
  };

  // Aggregates
  const totalCompleted = goals.filter((g) => g.status === "completed").length;
  const totalPending = goals.filter((g) => g.status !== "completed").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 lg:space-y-8"
      id="goals-page"
    >
      {/* 1. Dashboard Goals Header Stats Row */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        id="goals-metrics-bar"
      >
        {[
          {
            title: "Goals Completed",
            val: `${totalCompleted} Milestones`,
            sub: "Successfully compiled",
            textCol: "text-green-400",
          },
          {
            title: "Active Objectives",
            val: `${totalPending} Pending`,
            sub: "Sprints in motion",
            textCol: "text-accent-blue",
          },
          {
            title: "Available Rewards",
            val: "3,950 XP Stacked",
            sub: "Unlockable on achievement",
            textCol: "text-accent-purple",
          },
        ].map((met, idx) => (
          <div
            key={idx}
            className="p-4 bg-card-dark border border-card-border rounded-xl flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                {met.title}
              </span>
              <span
                className={`text-sm md:text-base font-sans font-bold ${met.textCol}`}
              >
                {met.val}
              </span>
              <p className="text-[10px] text-gray-500">{met.sub}</p>
            </div>
            <Trophy className="w-8 h-8 text-neutral-800 shrink-0" />
          </div>
        ))}
      </div>

      {/* 2. Structured Sections Grid layouts */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        id="goals-structural-columns"
      >
        {/* Daily Goals Columns */}
        {[
          {
            title: "Daily Objectives",
            dataset: dailyGoals,
            color: "text-accent-purple border-purple-900/30",
            cat: "daily",
          },
          {
            title: "Weekly Sprints",
            dataset: weeklyGoals,
            color: "text-accent-blue border-blue-900/30",
            cat: "weekly",
          },
          {
            title: "Monthly Roadmap",
            dataset: monthlyGoals,
            color: "text-amber-500 border-amber-900/30",
            cat: "monthly",
          },
        ].map((column, colIdx) => (
          <div
            key={colIdx}
            className="bg-card-dark border border-card-border p-4 rounded-xl flex flex-col justify-between space-y-4"
          >
            {/* Column Header title */}
            <div className="flex items-center justify-between pb-3 border-b border-card-border/60">
              <div className="flex items-center gap-2">
                <CircleDot
                  className={`w-4 h-4 ${column.color.split(" ")[0]}`}
                />
                <h3 className="text-xs font-semibold text-gray-200">
                  {column.title}
                </h3>
              </div>
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-gray-400 px-1.5 py-0.2 rounded-xs font-mono uppercase">
                {column.cat}
              </span>
            </div>

            {/* List entries */}
            <div className="space-y-3 flex-1">
              {column.dataset.length === 0 ? (
                <div className="text-center py-10 text-[10px] text-gray-500 font-mono">
                  No active goal tickets loaded.
                </div>
              ) : (
                column.dataset.map((goal) => {
                  const percentage = Math.round(
                    (goal.progress / goal.total) * 100,
                  );
                  const isDone = goal.status === "completed";

                  return (
                    <div
                      key={goal.id}
                      className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-lg space-y-3 relative group overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <h4
                            className={`text-xs font-semibold text-gray-200 leading-snug ${isDone ? "line-through text-gray-500" : ""}`}
                          >
                            {goal.title}
                          </h4>
                          <span className="text-[10px] text-zinc-600 font-mono">
                            reward: +{goal.rewardXP} XP
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 border rounded-sm shrink-0 ${
                            isDone
                              ? "text-green-400 bg-green-950/20 border-green-900/30"
                              : "text-zinc-400 bg-[#09090c] border-[#181820]"
                          }`}
                        >
                          {goal.progress}/{goal.total}
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div className="space-y-1.5">
                        <div className="relative w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isDone ? "bg-green-500" : "bg-accent-purple"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                          <span>{percentage}% complete</span>
                          {goal.timeRemaining && (
                            <span className="text-rose-400 font-medium">
                              ⚠️ {goal.timeRemaining}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Complete progress increment button */}
                      {!isDone && (
                        <button
                          onClick={() => handleIncrementProgress(goal.id)}
                          className="w-full opacity-60 group-hover:opacity-100 py-1 bg-[#050508] border border-neutral-800 text-zinc-400 hover:text-white rounded-md text-[9px] font-mono transition-opacity cursor-pointer mt-1"
                        >
                          + Record Step Increment
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GoalsTracker;
