"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/sidebar";
import { Command } from "lucide-react";

export function TeamSwitcher() {
  // const { isMobile } = useSidebar();
  // const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  // if (!activeTeam) {
  //   return null;
  // }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-purple-500/10 shrink-0">
                  <Command className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-sm font-sans font-semibold tracking-wider bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    DevFlow
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
