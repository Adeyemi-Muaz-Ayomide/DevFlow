"use client";
import { motion } from "motion/react";
import { WEEKLY_ANALYTICS_DATA } from "@/app/data/mockData";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Analytics = () => {
  // Custom mock analytics aggregate parameters
  const focusScoresList = [
    { name: "Mon", score: 85, target: 80 },
    { name: "Tue", score: 92, target: 80 },
    { name: "Wed", score: 78, target: 80 },
    { name: "Thu", score: 95, target: 80 },
    { name: "Fri", score: 88, target: 80 },
    { name: "Sat", score: 65, target: 80 },
    { name: "Sun", score: 90, target: 80 },
  ];

  const avgFocusHours = (
    WEEKLY_ANALYTICS_DATA.reduce((acc, curr) => acc + curr.focusHours, 0) / 7
  ).toFixed(1);
  const totalCommits = WEEKLY_ANALYTICS_DATA.reduce(
    (acc, curr) => acc + curr.commits,
    0,
  );
  const totalLOC = WEEKLY_ANALYTICS_DATA.reduce(
    (acc, curr) => acc + curr.codingLines,
    0,
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 lg:space-y-8"
      id="analytics-dashboard-page"
    >
      {/* 1. Analytics Aggregates Stats Summary Header Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        id="analytics-aggregate-bar"
      >
        {[
          {
            title: "Weekly Focus average",
            val: `${avgFocusHours} Hrs/day`,
            met: "92% focus score average",
            color: "text-accent-purple",
          },
          {
            title: "Sprint Commits",
            val: `${totalCommits} Commits`,
            met: "Across 4 active repositories",
            color: "text-accent-blue",
          },
          {
            title: "Compiled Lines of Code",
            val: `${totalLOC.toLocaleString()} Lines`,
            met: "Written on canary branches",
            color: "text-green-500",
          },
          {
            title: "Defect Squirms",
            val: "1.4 Def/sprint",
            met: "Spikes remain inside bounds",
            color: "text-amber-500",
          },
        ].map((agg, idx) => (
          <div
            key={idx}
            className="p-4 bg-card-dark border border-card-border rounded-xl space-y-1.5 shadow-xs"
          >
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">
              {agg.title}
            </span>
            <span
              className={`text-base md:text-lg font-sans font-bold ${agg.color}`}
            >
              {agg.val}
            </span>
            <p className="text-[10px] text-zinc-600 font-mono leading-none">
              {agg.met}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Visual Charts Bento Layout Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        id="analytics-charts-matrix"
      >
        {/* Widget A: Focus Hours & Completed Goals Daily Area Chart */}
        <div className="p-5 bg-card-dark border border-card-border rounded-xl space-y-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
              Analytical Metric #01
            </span>
            <h3 className="text-xs font-semibold text-gray-200">
              Daily Focus Sprints (Deep Hours)
            </h3>
          </div>

          <div className="h-56 w-full" id="focus-area-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={WEEKLY_ANALYTICS_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="areaColorFocus"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                  dataKey="focusHours"
                  name="Focus Minutes/Hours"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#areaColorFocus)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget B: Ticket completion volumes Bar Chart */}
        <div className="p-5 bg-card-dark border border-card-border rounded-xl space-y-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
              Analytical Metric #02
            </span>
            <h3 className="text-xs font-semibold text-gray-200">
              Weekly Task Velocity Volumes
            </h3>
          </div>

          <div className="h-56 w-full" id="task-completed-bar-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WEEKLY_ANALYTICS_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
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
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#0a0a0c",
                    border: "1px solid #16161a",
                    color: "#f4f4f5",
                    fontSize: "11px",
                    borderRadius: "6px",
                  }}
                />
                <Bar
                  dataKey="tasksCompleted"
                  name="Tickets Squashed"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget C: Lines of code commit distributions */}
        <div className="p-5 bg-card-dark border border-card-border rounded-xl space-y-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
              Analytical Metric #03
            </span>
            <h3 className="text-xs font-semibold text-gray-200">
              Canary Code Base Growth Volume
            </h3>
          </div>

          <div className="h-56 w-full" id="coding-lines-bar-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={WEEKLY_ANALYTICS_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="areaColorLOC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                  name="Lines Written (LOC)"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#areaColorLOC)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget D: Focus score history Line Chart */}
        <div className="p-5 bg-card-dark border border-card-border rounded-xl space-y-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
              Analytical Metric #04
            </span>
            <h3 className="text-xs font-semibold text-gray-200">
              Focus Index Stability score
            </h3>
          </div>

          <div className="h-56 w-full" id="focus-score-line-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={focusScoresList}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
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
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Active Focus Score (%)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Minimum Target"
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
