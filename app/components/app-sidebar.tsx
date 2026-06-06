"use client";

import * as React from "react";

import { NavMain } from "@/app/components/nav-main";

import { NavUser } from "@/app/components/nav-user";
import { TeamSwitcher } from "@/app/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/app/components/ui/sidebar";

import {
  Globe,
  CheckSquare,
  Flame,
  FileText,
  Trophy,
  Terminal,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GitBranch,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";

const data = {
  user: {
    name: "James",
    email: "James@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      id: "dashboard",
      title: "Command Center",
      url: "/dashboard",
      icon: Globe,
      isActive: true,
      count: null,
    },
    {
      id: "kanban",
      title: "Kanban Board",
      url: "/kanban-board",
      icon: CheckSquare,
      count: 3,
    },
    {
      id: "focus",
      title: "Focus Space",
      url: "/focus-space",
      icon: Flame,
      count: null,
    },
    {
      id: "notes",
      title: "Scratchpad",
      url: "/scratchpad",
      icon: FileText,
      count: 4,
    },
    {
      id: "goals",
      title: "Goals Tracker",
      url: "/goals-tracker",
      icon: Trophy,
      count: null,
    },
    {
      id: "Git",
      title: "Git Integration",
      url: "/Github",
      icon: GitBranch,
      count: null,
    },
    {
      id: "analytics",
      title: "Analytics",
      url: "/analytics",
      icon: Terminal,
      count: null,
    },
    {
      id: "calendar",
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      count: null,
    },
    {
      id: "achievements",
      title: "Achievements",
      url: "/achievements",
      icon: Trophy,
      count: null,
    },
  ] as const,
} as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentTab = useAppStore((state) => state.currentTab);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const xpPoints = useAppStore((state) => state.xpPoints);
  const userLevel = useAppStore((state) => state.userLevel);

  const { toggleSidebar, state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-card-border">
        <TeamSwitcher />
        <button
          // onClick={() => setIsCollapsed(!isCollapsed)}
          onClick={toggleSidebar}
          className="w-6 h-6 rounded-md border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </SidebarHeader>
      <SidebarContent>
        {!isCollapsed ? (
          <div
            className="p-4 mx-3 my-3 bg-neutral-900/60 border border-neutral-800/80 rounded-lg"
            id="sidebar-level-card"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500 font-sans uppercase tracking-wider">
                Level {userLevel} Dev
              </span>
              <span className="text-[10px] text-accent-purple font-sans font-semibold">
                {xpPoints} XP Total
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-accent-purple to-accent-blue h-full transition-all duration-500"
                style={{ width: `${(xpPoints % 1000) / 10}%` }}
              />
            </div>
          </div>
        ) : (
          <div
            className="py-4 flex justify-center text-xs font-sans font-semibold text-accent-purple"
            id="sidebar-level-shorthand"
          >
            Lvl {userLevel}
          </div>
        )}

        <NavMain
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items={data.navMain as any}
          currentTab={currentTab}
          onNavigate={setCurrentTab}
        />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// This is sample data.
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },

//   navMain: [
//     {
//       id: "dashboard",
//       title: "Command Center",
//       url: "#",
//       icon: Globe,
//       isActive: true,
//       items: [],
//     },
//     {
//       id: "kanban",
//       title: "Kanban Board",
//       url: "#",
//       icon: CheckSquare,
//       items: [],
//     },
//     {
//       id: "focus",
//       title: "Focus Space",
//       url: "#",
//       icon: Flame,
//       items: [],
//     },
//     {
//       id: "notes",
//       title: "Scratchpad",
//       url: "#",
//       icon: FileText,
//       items: [],
//     },
//     {
//       id: "goals",
//       title: "Goals Tracker",
//       url: "#",
//       icon: Trophy,
//       items: [],
//     },
//     {
//       id: "analytics",
//       title: "Analytics",
//       url: "#",
//       icon: Terminal,
//       items: [],
//     },
//     {
//       id: "calendar",
//       title: "Calendar",
//       url: "#",
//       icon: Calendar,
//       items: [],
//     },
//     {
//       id: "achievements",
//       title: "Achievements",
//       url: "#",
//       icon: Trophy,
//       items: [],
//     },
//   ],
// };
