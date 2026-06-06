export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "completed";

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  assignee: Assignee;
  dueDate: string;
  storyPoints?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  snippet: string;
  category: string; // e.g., "Documentation", "Algorithms", "Meeting Logs", "Personal Roadmap"
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

export type GoalCategory = "daily" | "weekly" | "monthly";
export type GoalStatus = "on_track" | "lagging" | "completed";

export interface Goal {
  id: string;
  title: string;
  progress: number;
  total: number;
  category: GoalCategory;
  iconName: string; // Lucide icon identifier
  status: GoalStatus;
  timeRemaining?: string;
  rewardXP?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  xp: number;
  category: "focus" | "tasks" | "github" | "consistency";
  badgeName: string;
  unlockedAt?: string;
}

export interface CommitActivity {
  sha: string;
  message: string;
  branch: string;
}

export interface PullRequestActivity {
  number: number;
  title: string;
  state: "open" | "merged" | "closed";
}

export interface GitHubActivity {
  id: string;
  type: "commit" | "pr" | "issue" | "release";
  repoName: string;
  description: string;
  time: string;
  statusText?: string;
  commit?: CommitActivity;
  pullRequest?: PullRequestActivity;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // HH:MM or YYYY-MM-DD
  date: string; // YYYY-MM-DD
  duration: string;
  type: "meeting" | "focus" | "deadline" | "personal";
  completed: boolean;
}

export type TabType =
  | "dashboard"
  | "kanban"
  | "focus"
  | "notes"
  | "goals"
  | "analytics"
  | "github"
  | "calendar"
  | "achievements";

export type PomodoroMode = "focus" | "short_break" | "long_break";
