"use client";

import { TabType } from "@/app/types/types";
import { Bell, Trophy } from "lucide-react";
import { useState } from "react";

const UtilityItems = () => {
  // Notifications summary indicators popup
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: "not-1",
      msg: "Alex Rivera deployed nextjs-prod to production",
      type: "system",
      time: "12m ago",
    },
    {
      id: "not-2",
      msg: "MFA architecture token needs cryptographic audit",
      type: "warning",
      time: "1h ago",
    },
  ]);
  const [userLevel, setUserLevel] = useState(4);
  const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  return (
    <div className="flex items-center gap-3">
      {/* Direct Quick Info Badge */}
      <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono tracking-wide bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-sm uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 breathing" />
        Sync Online (Adeyemi)
      </span>

      {/* Notification bell center trigger */}
      <div className="relative" id="notification-bell-icon">
        <button
          // onClick={() => setShowNotificationCenter(!showNotificationCenter)}
          className="p-1.5 rounded-md hover:bg-neutral-900 text-gray-400 hover:text-white transition-colors cursor-pointer relative"
          title="Notifications panel"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </button>

        {/* Notification Overlay Panel */}
        {showNotificationCenter && (
          <div
            className="absolute right-0 mt-3 w-80 bg-card-dark border border-card-border rounded-lg shadow-2xl p-2 space-y-1.5 text-xs z-[50]"
            id="navbar-notification-center-popup"
          >
            <div className="px-2 py-1.5 border-b border-card-border text-[10px] text-zinc-500 font-mono flex items-center justify-between">
              <span>Audit Notification Logs</span>
              <button
                onClick={() => setUnreadNotifications([])}
                className="text-zinc-600 hover:text-zinc-400 font-mono capitalize cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {unreadNotifications.length === 0 ? (
              <p className="text-center py-6 text-[10px] text-zinc-600 font-mono">
                No active unread log alerts.
              </p>
            ) : (
              unreadNotifications.map((not) => (
                <div
                  key={not.id}
                  className="p-2 hover:bg-neutral-900 bg-neutral-900/20 border border-neutral-800/40 rounded-md space-y-1"
                >
                  <p className="text-gray-300 font-sans tracking-wide leading-relaxed">
                    {not.msg}
                  </p>
                  <span className="text-[8px] text-zinc-600 font-mono block text-right">
                    {not.time}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Micro Quick stats badge */}
      <div
        // onClick={() => setCurrentTab("achievements")}
        className="flex items-center gap-1 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20 px-2 py-1 rounded-md text-xs text-amber-500 font-mono cursor-pointer transition-colors"
        title="Unlock milestone achievements panel"
      >
        <Trophy className="w-3.5 h-3.5" />
        <span>Lvl {userLevel}</span>
      </div>
    </div>
  );
};

export default UtilityItems;
