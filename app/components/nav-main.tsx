"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import { TabType } from "../types/types";
import Link from "next/link";

export function NavMain({
  items,
  currentTab,
  onNavigate,
}: {
  items: {
    id: TabType;
    title: string;
    url: string;
    icon: React.ElementType;
    count: number;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <SidebarMenuItem key={item.id}>
              <Link href={item.url}>
                <SidebarMenuButton
                  className="data-[active=true]:bg-gray-700/10 data-[active=true]:text-white data-[active=true]:font-medium data-[active=true]:border data-[active=true]:border-neutral-800/80 text-zinc-500 hover:text-white data-[active=true]:py-5 flex items-center justify-between font-sans! cursor-pointer "
                  isActive={currentTab === item.id}
                  tooltip={item.title}
                  onClick={() => onNavigate(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-accent-purple"
                          : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    <span className="font-sans! text-[13.5px] font-light">
                      {item.title}
                    </span>
                  </div>

                  {item.count !== null && (
                    <span className="text-[13px] bg-neutral-800/80 text-zinc-400 px-1.5 py-0.5 rounded-sm font-mono scale-90">
                      {item.count}
                    </span>
                  )}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
