"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { GitHubActivity } from "@/app/types/types";
import { CONTRIB_GRID_DATA, MOCK_GITHUB_EVENTS } from "@/app/data/mockData";
import { useAppStore } from "@/app/store/useAppStore";
import {
  CircleDot,
  GitBranch,
  GitCommit,
  GitPullRequest,
  ShieldCheck,
  Tag,
} from "lucide-react";

const GithubPage = () => {
  // const [activityEvents, setActivityEvents] =
  //   useState<GitHubActivity[]>(MOCK_GITHUB_EVENTS);
  const [selectedRepo, setSelectedRepo] = useState("All Repos");
  const addXP = useAppStore((state) => state.addXP);
  const [activityFeed, setActivityFeed] =
    useState<GitHubActivity[]>(MOCK_GITHUB_EVENTS);
  const [currentHoveredDay, setCurrentHoveredDay] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const repositories = [
    "All Repos",
    "vercel/next.js",
    "prisma/prisma-engines",
    "facebook/react",
    "shadcn/ui",
    "tailwindlabs/tailwindcss",
  ];

  // Shading helper for contribution cells (GitHub dark theme style green grids)
  const getHeatmapColorClass = (count: number) => {
    if (count === 0) return "bg-[#161b22] hover:bg-[#21262d]";
    if (count <= 2) return "bg-[#0e4429] hover:bg-[#125835]";
    if (count <= 4) return "bg-[#006d32] hover:bg-[#008a3f]";
    if (count <= 6) return "bg-[#26a641] hover:bg-[#32c954]";
    return "bg-[#39d353] hover:bg-[#46e962]";
  };

  // Handle mock closing of a GitHub Issue ticket
  const handleResolveIssue = (id: string) => {
    setActivityFeed((prev) =>
      prev.map((evt) =>
        evt.id === id
          ? {
              ...evt,
              statusText: "resolved",
              description: "fully closed and audited",
            }
          : evt,
      ),
    );
    addXP(150);
    alert("GitHub Issue synchronized & resolved successfully! Gained +150 XP.");
  };

  const filteredEvents =
    selectedRepo === "All Repos"
      ? activityFeed
      : activityFeed.filter((evt) => evt.repoName === selectedRepo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 lg:space-y-8"
      id="github-integration-view"
    >
      {/* 1. Header with Repository filtering Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <h2 className="text-lg font-sans font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" /> GitHub Sync-feed
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time contribution audit trails and branch deployments pipeline.
          </p>
        </div>

        {/* Repository list dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">
            Context Repo:
          </span>
          <select
            className="bg-[#030304] border border-card-border rounded-lg text-xs p-2 text-zinc-300 outline-hidden hover:border-neutral-700 transition-colors"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
          >
            {repositories.map((repo) => (
              <option key={repo} value={repo}>
                {repo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Linear / GitHub Signature Contribution Grid Heatmap widget */}
      <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-gray-200">
              Personal Contribution Index
            </h3>
            <p className="text-[10px] text-gray-500 font-sans">
              Grid displays commits registered across last 30 weekdays
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-mono">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-[#161b22]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0e4429]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#006d32]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#26a641]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#39d353]" />
            <span>More</span>
          </div>
        </div>

        {/* The Grid */}
        <div className="bg-[#030304]/60 border border-card-border p-4 rounded-lg overflow-x-auto">
          <div className="flex flex-col gap-1 min-w-140">
            {/* Squares rows */}
            <div
              className="grid grid-cols-10 gap-1.5"
              id="contrib-grid-squares"
            >
              {CONTRIB_GRID_DATA.map((day, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() =>
                    setCurrentHoveredDay({ date: day.date, count: day.count })
                  }
                  onMouseLeave={() => setCurrentHoveredDay(null)}
                  className={`aspect-square w-full rounded-sm transition-all duration-150 cursor-crosshair relative ${getHeatmapColorClass(day.count)}`}
                  id={`contrib-cell-${idx}`}
                />
              ))}
            </div>

            {/* Hover tooltip bar */}
            <div className="h-6 mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-card-border/40 pt-2 shrink-0">
              {currentHoveredDay ? (
                <span className="text-accent-blue font-medium">
                  → {currentHoveredDay.date}:{" "}
                  <strong className="text-white">
                    {currentHoveredDay.count} commits
                  </strong>{" "}
                  deployed to master.
                </span>
              ) : (
                <span>
                  Hover over any grid cell to audit commits breakdown
                  parameters.
                </span>
              )}
              <span>
                🔥 Current Deployment Streak:{" "}
                <strong className="text-white">12 Days</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Splitted Feed Layout: PRs & Commits Row */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        id="github-feed-bento"
      >
        {/* Left pane: Active Commits and Pull Requests */}
        <div className="bg-card-dark border border-card-border rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-purple-400" /> Integrated
            Pipeline Event Feed
          </h3>

          <div className="space-y-3" id="github-event-feed-list">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-[10px] text-zinc-500 font-mono">
                No telemetry events on filtered repository.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-lg space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {evt.type === "commit" && (
                        <GitCommit className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      )}
                      {evt.type === "pr" && (
                        <GitPullRequest className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      )}
                      {evt.type === "issue" && (
                        <CircleDot className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      {evt.type === "release" && (
                        <Tag className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      )}

                      <span className="text-xs font-semibold text-gray-200 truncate">
                        {evt.repoName}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono shrink-0">
                      {evt.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-1 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Supplemental data block depending on type */}
                  {evt.commit && (
                    <div className="p-2 bg-[#030304]/60 border border-neutral-900 rounded font-mono text-[10px] text-accent-blue flex items-center justify-between gap-4">
                      <span className="truncate">
                        &quot;{evt.commit.message}&quot;
                      </span>
                      <span className="text-[9px] bg-neutral-900 border border-neutral-800 px-1 text-zinc-500 font-mono rounded shrink-0">
                        {evt.commit.sha} ({evt.commit.branch})
                      </span>
                    </div>
                  )}

                  {evt.pullRequest && (
                    <div className="p-2 bg-purple-950/10 border border-purple-900/20 rounded font-mono text-[10px] text-purple-400 flex items-center justify-between gap-4">
                      <span className="truncate">
                        PR #{evt.pullRequest.number}: &quot;
                        {evt.pullRequest.title}&quot;
                      </span>
                      <span className="text-[9px] uppercase px-1.5 rounded-sm bg-purple-950/20 border border-purple-800 text-purple-400 font-bold shrink-0">
                        {evt.pullRequest.state}
                      </span>
                    </div>
                  )}

                  {evt.type === "issue" && evt.statusText === "unresolved" && (
                    <button
                      onClick={() => handleResolveIssue(evt.id)}
                      className="px-2 py-0.5 bg-amber-950/20 hover:bg-amber-950/40 text-amber-500 border border-amber-900/30 rounded-xs text-[9px] font-mono transition-colors cursor-pointer block"
                    >
                      ✓ Sync Issue Audit & Close
                    </button>
                  )}

                  {evt.type === "issue" && evt.statusText === "resolved" && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-green-950/20 text-green-400 border border-green-900/30 font-mono inline-block">
                      ✓ Audit Closed
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right pane: Repo Overview Status metrics */}
        <div className="space-y-6">
          {/* Active branch status metrics */}
          <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-200">
              Active Deployment Environments
            </h3>

            <div
              className="space-y-3 font-mono text-[11px]"
              id="deployment-environments-rows"
            >
              {[
                {
                  env: "nextjs-prod",
                  repo: "vercel/next.js",
                  status: "Active Live",
                  color: "text-green-400",
                  latency: "14ms",
                },
                {
                  env: "prisma-engine-main",
                  repo: "prisma/prisma-engines",
                  status: "Passing",
                  color: "text-green-400",
                  latency: "240ms",
                },
                {
                  env: "canvas-react-sandbox",
                  repo: "facebook/react",
                  status: "Awaiting PR",
                  color: "text-purple-400",
                  latency: "—",
                },
                {
                  env: "ui-component-canary",
                  repo: "shadcn/ui",
                  status: "Failing logs",
                  color: "text-rose-400",
                  latency: "1250ms",
                },
              ].map((dep, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-900/40 border border-neutral-800/60 rounded-lg flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-gray-200 font-bold">{dep.env}</span>
                    <span className="text-[9px] text-zinc-600 block">
                      {dep.repo}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${dep.color}`}>
                      {dep.status}
                    </span>
                    <span className="text-[9px] text-zinc-600 block">
                      rt: {dep.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure CI status logs */}
          <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <h3 className="text-xs font-semibold text-gray-200">
                Action Health Integrations
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              Deployment keys are signed internally with SHA-256 and
              authenticated on each commit action. No credential leakage is
              possible.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GithubPage;
