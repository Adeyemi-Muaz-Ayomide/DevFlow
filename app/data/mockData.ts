import {
  Task,
  Note,
  Goal,
  Achievement,
  GitHubActivity,
  CalendarEvent,
} from "../types/types";

export const MOCK_ASSIGNEES = {
  alex: {
    name: "Alex Rivera",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    role: "Tech Lead",
  },
  sarah: {
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    role: "Senior Backend Eng",
  },
  marcus: {
    name: "Marcus Vance",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
    role: "Frontend Developer",
  },
  elena: {
    name: "Elena Rostova",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    role: "DevOps Architect",
  },
};

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Optimize prisma client connection pooling inside edge runtimes",
    description:
      "Cold start timings are spiking upwards of 800ms. We should switch to utilizing native global cached connection pools in the edge entry files.",
    priority: "urgent",
    status: "in_progress",
    tags: ["Prisma", "Database", "Edge Systems"],
    assignee: MOCK_ASSIGNEES.sarah,
    dueDate: "2026-06-02",
    storyPoints: 5,
  },
  {
    id: "task-2",
    title: "Refactor nested layout route state inside the App Router",
    description:
      "The sidebar context keeps triggering redundant re-renders on page change, introducing a noticeable flicker in the viewport layouts.",
    priority: "high",
    status: "todo",
    tags: ["Next.js", "React State", "CSS Glassmorphism"],
    assignee: MOCK_ASSIGNEES.marcus,
    dueDate: "2026-06-04",
    storyPoints: 3,
  },
  {
    id: "task-3",
    title: "Implement secure MFA token encryption validation service",
    description:
      "Add support for time-based TOTP using HMAC on the cryptographic server side, avoiding client-side credential exposure.",
    priority: "high",
    status: "review",
    tags: ["Crypto", "Auth", "Security"],
    assignee: MOCK_ASSIGNEES.alex,
    dueDate: "2026-06-01",
    storyPoints: 8,
  },
  {
    id: "task-4",
    title: "Audit package lock dependencies for CVE security hazards",
    description:
      "A vulnerability was flagged on sub-dependency parser-engine v2.0.4. Need to force resolution overrides to v2.0.8.",
    priority: "medium",
    status: "backlog",
    tags: ["Security Audit", "Dependencies"],
    assignee: MOCK_ASSIGNEES.elena,
    dueDate: "2026-06-12",
    storyPoints: 2,
  },
  {
    id: "task-5",
    title: "Configure automatic code splitting for charts overlay bundles",
    description:
      "The Recharts dependency is loading standard inline. Make it lazy-loaded so dashboard bundle sizes slide back under 140kb.",
    priority: "low",
    status: "todo",
    tags: ["Vite", "Bundle Size", "Frontend Optimization"],
    assignee: MOCK_ASSIGNEES.marcus,
    dueDate: "2026-06-08",
    storyPoints: 2,
  },
  {
    id: "task-6",
    title: "Resolve docker container memory leak on telemetry logging",
    description:
      "The telemetry daemon collects debug metrics but fails to flush standard output buffer. It crashes the cluster nodes daily.",
    priority: "urgent",
    status: "completed",
    tags: ["Docker", "Telemetry", "Diagnostics"],
    assignee: MOCK_ASSIGNEES.elena,
    dueDate: "2026-05-30",
    storyPoints: 5,
  },
  {
    id: "task-7",
    title: "Redesign task checklist hover actions with Spring animations",
    description:
      "Hovering over a list cell should perform a tiny translation transition with smooth damping of spring curves.",
    priority: "medium",
    status: "backlog",
    tags: ["Framer Motion", "Animations"],
    assignee: MOCK_ASSIGNEES.marcus,
    dueDate: "2026-06-15",
    storyPoints: 1,
  },
  {
    id: "task-8",
    title: "Migrate database structures & schemas to new Vercel Postgres",
    description:
      "Sync current local files, recreate indices on composite queries, run full schema testing with zero lock flags on tables.",
    priority: "high",
    status: "completed",
    tags: ["Postgres", "Migration", "Database"],
    assignee: MOCK_ASSIGNEES.alex,
    dueDate: "2026-05-28",
    storyPoints: 8,
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Vite Custom Bundle Splitting Architecture",
    snippet:
      "To prevent Recharts and Lucide packages from expanding the main vendor index file, customize manualChunks inside roll-up config...",
    content: `# Vite Custom Bundle Splitting

Optimizing bundle delivery allows React applications to preserve instant interactive responses. Inside \`vite.config.ts\`, modify the roll-up options to manual partition bundles:

\`\`\`typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
\`\`\`

## Expected Gains
- Shaves main index asset bundle from **410kb** down to **125kb**
- Allows browser to stream resources concurrently`,
    category: "Vite Config",
    updatedAt: "2/3 Hours Ago",
    isFavorite: true,
    tags: ["Vite", "Performance", "Optimization"],
  },
  {
    id: "note-2",
    title: "Next.js Route Interceptors for Modals",
    snippet:
      "Route interception acts as a brilliant UI mechanism to exhibit details overlay cards without forcing full-blown routing context adjustments...",
    content: `# Next.js Route Intercepting & Parallel Routing

Parallel routes allow you to render multiple pages simultaneously within the same layout structure, which is ideal if you're loading a sliding overlay drawer.

## Directory Structure
\`\`\`
/app
  /feed
    layout.tsx
    page.tsx
    @modal
      /(.)photo/[id]
        page.tsx
      default.tsx
\`\`\`

By utilizing \`@modal/(.)photo/[id]\`, we can capture the route change and render the photo in a modal view, while keeping the background feed visible!

## Best Practices
1. Render standard content in \`default.tsx\` to prevent loading empty screen segments on refresh.
2. Provide simple fallback wrappers around client-side modals.`,
    category: "Next.js Tips",
    updatedAt: "Yesterday",
    isFavorite: true,
    tags: ["Next.js", "Routing", "Architecture"],
  },
  {
    id: "note-3",
    title: "Prisma Relation Optimization Strategies",
    snippet:
      "Ensure relation-rich raw join operations do not cause heavy CPU load. Use select payloads over full-depth nested object lookups...",
    content: `# Optimizing Prisma Connections

Prisma does query multiplexing automatically. However, heavy nested tables can cause issues structure-wise.

## Bad Query Pattern
\`\`\`typescript
const userWithEverything = await prisma.user.findMany({
  include: {
    posts: {
      include: {
        comments: {
          include: { author: true }
        }
      }
    }
  }
});
\`\`\`

This pattern translates to several bulk nested select operations that exceed database buffers.

## Preferred High-Speed Alternative
Select specifically needed attributes:
\`\`\`typescript
const userFast = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true
      }
    }
  }
});
\`\`\`
Reducing size from 2MB json output down to 34KB.`,
    category: "Database",
    updatedAt: "3 Days Ago",
    isFavorite: false,
    tags: ["Database", "SQL", "TypeScript"],
  },
  {
    id: "note-4",
    title: "CSS Grid Shorthand Cheatsheet",
    snippet:
      "A reference list for dynamic auto-fit grid sizing setups. Responsive container layouts can fully skip `@media` queries entirely...",
    content: `# Responsive CSS Grid Without Media Queries

Using simple modern CSS parameters simplifies mobile, tablet, and ultra-wide monitor responsive sizing:

\`\`\`css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`

## Core Mechanics
- \`auto-fit\`: Fills the row with existing cards, stretching them if empty.
- \`minmax(280px, 1fr)\`: Cards can never shrink smaller than 280px wide but can grow to occupy proportional space equally.`,
    category: "CSS Layouts",
    updatedAt: "May 24",
    isFavorite: false,
    tags: ["CSS", "Web Design", "Tailwind"],
  },
];

export const MOCK_GOALS: Goal[] = [
  // Daily goals
  {
    id: "goal-1",
    title: "Complete 4 Pomodoro Work blocks",
    progress: 3,
    total: 4,
    category: "daily",
    iconName: "Timer",
    status: "on_track",
    timeRemaining: "4 hours left",
    rewardXP: 150,
  },
  {
    id: "goal-2",
    title: "Complete 3 Kanban task tickets",
    progress: 3,
    total: 3,
    category: "daily",
    iconName: "CheckSquare",
    status: "completed",
    rewardXP: 200,
  },
  {
    id: "goal-3",
    title: "Contribute to open repositories",
    progress: 0,
    total: 1,
    category: "daily",
    iconName: "GitCommit",
    status: "lagging",
    timeRemaining: "4 hours left",
    rewardXP: 100,
  },
  // Weekly goals
  {
    id: "goal-4",
    title: "Maintain 20 focus hours weekly",
    progress: 17.5,
    total: 20,
    category: "weekly",
    iconName: "Flame",
    status: "on_track",
    timeRemaining: "2 days left",
    rewardXP: 500,
  },
  {
    id: "goal-5",
    title: "Squash 15 Backlog backlog bugs",
    progress: 12,
    total: 15,
    category: "weekly",
    iconName: "ShieldAlert",
    status: "on_track",
    timeRemaining: "2 days left",
    rewardXP: 400,
  },
  // Monthly goals
  {
    id: "goal-6",
    title: "Complete full cloud cluster migration",
    progress: 100,
    total: 100,
    category: "monthly",
    iconName: "CloudLightning",
    status: "completed",
    rewardXP: 1500,
  },
  {
    id: "goal-7",
    title: "Read 3 technical code design books",
    progress: 1,
    total: 3,
    category: "monthly",
    iconName: "BookOpen",
    status: "lagging",
    timeRemaining: "14 days left",
    rewardXP: 850,
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    name: "Absolute Focus Master",
    description:
      "Complete 10 focused Pomodoro work slots without pausing the session timer",
    unlocked: true,
    xp: 500,
    category: "focus",
    badgeName: "FocusIcon",
    unlockedAt: "3 Days Ago",
  },
  {
    id: "ach-2",
    name: "Git Committer Champion",
    description:
      "Accumulate 50 contributions (commits, pull-requests) on the activity index",
    unlocked: true,
    xp: 400,
    category: "github",
    badgeName: "GithubIcon",
    unlockedAt: "Yesterday",
  },
  {
    id: "ach-3",
    name: "Perfect Weekly Sprint",
    description:
      "Complete every assigned Kanban task ticket before the scheduled Friday review",
    unlocked: false,
    xp: 1000,
    category: "tasks",
    badgeName: "CalendarIcon",
  },
  {
    id: "ach-4",
    name: "Centurion Streak",
    description:
      "Maintain a productivity action streak for 30 consecutive calendar days",
    unlocked: false,
    xp: 1500,
    category: "consistency",
    badgeName: "StreakIcon",
  },
  {
    id: "ach-5",
    name: "Early Bird General",
    description:
      "Complete a Pomodoro session block before 8:00 AM on a weekday workspace",
    unlocked: true,
    xp: 300,
    category: "focus",
    badgeName: "SunIcon",
    unlockedAt: "Last Tuesday",
  },
  {
    id: "ach-6",
    name: "Refactor Kingpin",
    description:
      "Delete more than 1,000 lines of stagnant code while completing a resolved ticket",
    unlocked: false,
    xp: 800,
    category: "tasks",
    badgeName: "TrashIcon",
  },
];

export const MOCK_GITHUB_EVENTS: GitHubActivity[] = [
  {
    id: "git-1",
    type: "commit",
    repoName: "vercel/next.js",
    description: "comitted to `canary` branch with fix metrics",
    time: "12 mins ago",
    commit: {
      sha: "8fbc923",
      message:
        "fix(router): prevent state synchronization loops inside subgrids",
      branch: "canary",
    },
  },
  {
    id: "git-2",
    type: "pr",
    repoName: "prisma/prisma-engines",
    description: "opened a brand new feature pull request",
    time: "1 hour ago",
    pullRequest: {
      number: 1408,
      title:
        "feat(client): expose raw connection telemetry handlers in edge client hook",
      state: "open",
    },
  },
  {
    id: "git-3",
    type: "issue",
    repoName: "shadcn/ui",
    description: "raised descriptive report on accessibility",
    time: "4 hours ago",
    statusText: "resolved",
  },
  {
    id: "git-4",
    type: "commit",
    repoName: "facebook/react",
    description: "merged commit from master configuration branch",
    time: "1 day ago",
    commit: {
      sha: "ca79410",
      message: "maint: upgrade structural render contexts regarding scheduling",
      branch: "main",
    },
  },
  {
    id: "git-5",
    type: "release",
    repoName: "tailwindlabs/tailwindcss",
    description: "published a major engine tag upgrade version",
    time: "2 days ago",
    statusText: "v4.1.14",
  },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "Daily Standup sync-point",
    start: "10:00",
    date: "2026-06-01",
    duration: "15m",
    type: "meeting",
    completed: true,
  },
  {
    id: "cal-2",
    title: "MFA Token Architecture Review",
    start: "11:30",
    date: "2026-06-01",
    duration: "45m",
    type: "meeting",
    completed: false,
  },
  {
    id: "cal-3",
    title: "Prisma Connection Focus Hour",
    start: "14:00",
    date: "2026-06-01",
    duration: "1h 30m",
    type: "focus",
    completed: false,
  },
  {
    id: "cal-4",
    title: "Next.js Route Re-renders audit",
    start: "17:00",
    date: "2026-06-02",
    duration: "1h",
    type: "focus",
    completed: false,
  },
  {
    id: "cal-5",
    title: "Deploy Vercel MFA patch",
    start: "18:00",
    date: "2026-06-01",
    duration: "deadline",
    type: "deadline",
    completed: false,
  },
  {
    id: "cal-6",
    title: "Core Database migration",
    start: "22:00",
    date: "2026-05-31",
    duration: "2h",
    type: "deadline",
    completed: true,
  },
];

// Seed contribution heatmap for github contributions metrics (last 30 days)
export const CONTRIB_GRID_DATA = Array.from({ length: 30 }, (_, index) => {
  const contributions = [
    0, 1, 2, 0, 4, 3, 5, 2, 0, 8, 4, 1, 0, 5, 6, 7, 3, 0, 1, 4,
  ][index % 20];
  const date = new Date(Date.now() - (29 - index) * 24 * 60 * 60 * 1000);
  return {
    date: date.toISOString().split("T")[0],
    count: contributions,
    dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
  };
});

// Seed Analytics Data for custom charts
export const WEEKLY_ANALYTICS_DATA = [
  {
    name: "Mon",
    focusHours: 4.5,
    tasksCompleted: 5,
    codingLines: 450,
    commits: 4,
  },
  {
    name: "Tue",
    focusHours: 6.2,
    tasksCompleted: 8,
    codingLines: 820,
    commits: 7,
  },
  {
    name: "Wed",
    focusHours: 5.0,
    tasksCompleted: 4,
    codingLines: 510,
    commits: 3,
  },
  {
    name: "Thu",
    focusHours: 7.8,
    tasksCompleted: 9,
    codingLines: 1200,
    commits: 11,
  },
  {
    name: "Fri",
    focusHours: 6.5,
    tasksCompleted: 6,
    codingLines: 760,
    commits: 5,
  },
  {
    name: "Sat",
    focusHours: 2.1,
    tasksCompleted: 2,
    codingLines: 180,
    commits: 1,
  },
  {
    name: "Sun",
    focusHours: 3.5,
    tasksCompleted: 3,
    codingLines: 290,
    commits: 2,
  },
];
