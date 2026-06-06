"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Achievement } from "@/app/types/types";
import { MOCK_ACHIEVEMENTS } from "@/app/data/mockData";
import { useAppStore } from "@/app/store/useAppStore";
import {
  Award,
  Calendar,
  Flame,
  Gift,
  GitBranch,
  LockKeyhole,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

const Achievements = () => {
  const [badges, setBadges] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [claimedBonusToday, setClaimedBonusToday] = useState(false);
  const xpPoints = useAppStore((state) => state.xpPoints);
  const userLevel = useAppStore((state) => state.userLevel);
  const addXP = useAppStore((state) => state.addXP);
  const addStreak = useAppStore((state) => state.addStreak);

  // Compute points remaining to level up
  const nextLevelThreshold = 4000;
  const currentThresholdBase = 3000;
  const progressRatio =
    ((xpPoints - currentThresholdBase) /
      (nextLevelThreshold - currentThresholdBase)) *
    100;

  const handleClaimDailyStreakReward = () => {
    addXP(100);
    addStreak(1);
  };

  // Handle mock daily streak claim
  const handleClaimBonus = () => {
    if (claimedBonusToday) return;
    setClaimedBonusToday(true);
    handleClaimDailyStreakReward();
  };

  // Helper badge icons router match
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "FocusIcon":
        return Flame;
      case "GithubIcon":
        return GitBranch;
      case "CalendarIcon":
        return Calendar;
      case "StreakIcon":
        return Zap;
      case "SunIcon":
        return Sparkles;
      default:
        return Award;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 lg:space-y-8"
      id="achievements-page"
    >
      {/* 1. Level progression header metric card panel */}
      <div className="bg-card-dark border border-card-border p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative glow-card">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left indicators */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-950/40 text-accent-purple border border-purple-900/30 rounded-lg shrink-0">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest block">
                User Level Profile
              </span>
              <h2 className="text-base md:text-lg font-sans font-bold text-white tracking-tight">
                Level {userLevel} Senior Software Architect
              </h2>
            </div>
          </div>

          {/* Sizing indicators */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-linear-to-r from-accent-purple to-accent-blue h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>{xpPoints} XP Earned</span>
              <span>
                {nextLevelThreshold - xpPoints} XP to Level {userLevel + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Claim daily streak bonus interactive action */}
        <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-lg shrink-0 flex flex-col items-center justify-center text-center space-y-2 max-w-xs relative overflow-hidden">
          <Gift className="w-6 h-6 text-amber-500" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-gray-200">
              Daily Streak Bonus Loot
            </h4>
            <p className="text-[9px] text-gray-500">
              Claim your daily developer XP bonus parcel instantly.
            </p>
          </div>

          <button
            onClick={handleClaimBonus}
            disabled={claimedBonusToday}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-mono border tracking-wide transition-colors cursor-pointer ${
              claimedBonusToday
                ? "bg-zinc-800/20 text-zinc-500 border-zinc-800/40 cursor-not-allowed"
                : "bg-accent-purple hover:bg-purple-600 text-white border-purple-800 hover:border-purple-700"
            }`}
          >
            {claimedBonusToday
              ? "✓ Claimed Parcel Today"
              : "Claim +100 XP Loot"}
          </button>
        </div>
      </div>

      {/* 2. Achievements Milestones Badges list container */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
            Unlockable Sprint Badges Archive
          </h3>
          <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
            Accumulate points in DevFlow sectors to unlock these limited badges.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          id="achievements-badges-grid"
        >
          {badges.map((badge) => {
            const Icon = getBadgeIcon(badge.badgeName);
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all duration-200 relative overflow-hidden flex items-start gap-4 ${
                  isUnlocked
                    ? "bg-card-dark border-[#1b1b24] shadow-xs hover:border-[#2e2e3f]"
                    : "bg-[#040407] border-card-border/60 opacity-60"
                }`}
                id={`badge-card-${badge.id}`}
              >
                {/* Glowing subtle ring around icon for unlocked styles */}
                <div
                  className={`p-2.5 rounded-lg border shrink-0 relative ${
                    isUnlocked
                      ? "bg-purple-950/20 text-accent-purple border-purple-900/30"
                      : "bg-zinc-950 text-zinc-600 border-zinc-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isUnlocked && (
                    <span className="absolute -bottom-1 -right-1 bg-red-950 border border-red-900 text-rose-400 p-0.5 rounded-full scale-75">
                      <LockKeyhole className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Details text cells */}
                <div className="space-y-1 min-w-0 pr-4">
                  <h4
                    className={`text-xs font-semibold truncate ${isUnlocked ? "text-white" : "text-zinc-500 line-through"}`}
                  >
                    {badge.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 font-mono text-[9px]">
                    <span className="text-zinc-600 block">
                      reward: +{badge.xp} XP
                    </span>
                    {badge.unlockedAt && (
                      <>
                        <span className="h-2 w-px bg-neutral-800" />
                        <span className="text-gray-500">
                          unlocked: {badge.unlockedAt}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Achievements;
