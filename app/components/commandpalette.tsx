"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Globe,
  Terminal,
  FileText,
  CheckSquare,
  Flame,
  Trophy,
  Calendar,
  GitBranchIcon,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useRouter } from "next/navigation";

const CommandPalette = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const setPomodoroMode = useAppStore((state) => state.setPomodoroMode);
  // const isTimerActive = useAppStore((state) => state.isTimerActive);
  const toggleTimer = useAppStore((state) => state.toggleTimer);

  const openPalette = useCallback(() => {
    setSearch("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  const onStartPomodoro = useCallback(() => {
    toggleTimer();
    setPomodoroMode("focus");
  }, [toggleTimer, setPomodoroMode]);

  const onAddTaskShortcut = useCallback(() => {
    setCurrentTab("kanban");
    alert("Opening quick task creation drawer inside Kanban view!");
  }, [setCurrentTab]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [openPalette]);

  // Keyboard navigation inside command palette
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const items = useMemo(
    () => [
      {
        id: "nav-dash",
        label: "Navigate to Command Dashboard",
        category: "Navigation",
        icon: Globe,
        action: () => router.push("/dashboard"),
      },
      {
        id: "nav-kanban",
        label: "Navigate to Kanban Board (Linear style)",
        category: "Navigation",
        icon: CheckSquare,
        action: () => router.push("/kanban-board"),
      },
      {
        id: "nav-focus",
        label: "Open Focus Space (Pomodoro)",
        category: "Navigation",
        icon: Flame,
        action: () => router.push("/focus-space"),
      },
      {
        id: "nav-notes",
        label: "Open Scratchpad Notes Editor",
        category: "Navigation",
        icon: FileText,
        action: () => router.push("/scratchpad"),
      },
      {
        id: "nav-goals",
        label: "Review Goals & Alignment Progress",
        category: "Navigation",
        icon: Trophy,
        action: () => router.push("/goals-tracker"),
      },
      {
        id: "nav-analytics",
        label: "Open Productivity Analytics",
        category: "Navigation",
        icon: Terminal,
        action: () => router.push("/analytics"),
      },
      {
        id: "nav-github",
        label: "Inspect Github Contribution Integrations",
        category: "Navigation",
        icon: GitBranchIcon,
        action: () => router.push("/Github"),
      },
      {
        id: "nav-cal",
        label: "Review Tasks Calendar Grid",
        category: "Navigation",
        icon: Calendar,
        action: () => router.push("/calendar"),
      },
      {
        id: "nav-achieve",
        label: "Inspect Unlockable Achievements",
        category: "Navigation",
        icon: Trophy,
        action: () => router.push("/achievements"),
      },

      {
        id: "act-focus",
        label: "Start 25m Pomodoro Focus Session",
        category: "Actions",
        icon: Flame,
        action: () => {
          if (onStartPomodoro) onStartPomodoro();
          router.push("/focus-space");
        },
      },
      {
        id: "act-task",
        label: "Create New Quick Task Ticket",
        category: "Actions",
        icon: CheckSquare,
        action: () => {
          if (onAddTaskShortcut) onAddTaskShortcut();
        },
      },
    ],
    [onAddTaskShortcut, onStartPomodoro, router],
  );

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev + 1) % Math.max(1, filteredItems.length),
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredItems.length) %
            Math.max(1, filteredItems.length),
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blurring filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
            onClick={onClose}
            id="command-palette-backdrop"
          />

          {/* Modal layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-card-dark border border-card-border rounded-xl shadow-2xl z-60 overflow-hidden"
            id="command-palette-container"
          >
            {/* Search Input field */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 border-b border-card-border bg-[#0d0d10]"
              id="command-search-bar"
            >
              <Search className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent text-gray-200 outline-hidden placeholder-gray-600 text-sm font-sans"
                placeholder="Search command center or route tabs... (Use Arrow Keys & Enter)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                id="command-input-field"
              />
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-gray-400 px-2 py-0.5 rounded-sm font-mono uppercase shrink-0">
                esc
              </span>
            </div>

            {/* List entries */}
            <div
              className="max-h-85 overflow-y-auto p-2 space-y-1"
              id="command-results-list"
            >
              {filteredItems.length === 0 ? (
                <div
                  className="text-center py-8 text-xs text-gray-500 font-mono"
                  id="no-matching-command"
                >
                  No matching workspace actions found.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-md cursor-pointer transition-colors duration-150 ${
                        isSelected
                          ? "bg-neutral-900 border border-neutral-800/80 text-white"
                          : "text-gray-400 hover:bg-[#0c0c10] border border-transparent"
                      }`}
                      id={`command-item-${item.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent
                          className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent-purple" : "text-gray-500"}`}
                        />
                        <span className="text-xs font-sans font-medium">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-sans uppercase">
                          {item.category}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-neutral-800 text-gray-300 px-1.5 py-0.5 rounded-sm font-mono uppercase">
                            enter
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Dynamic keyboard action indicator bar */}
            <div
              className="px-4 py-2 border-t border-card-border bg-[#050507] flex items-center justify-between text-[10px] text-gray-500 font-mono"
              id="command-palette-footer"
            >
              <span className="flex items-center gap-1">
                Use{" "}
                <kbd className="bg-neutral-900 px-1 py-0.5 rounded-sm">↑</kbd>{" "}
                <kbd className="bg-neutral-900 px-1 py-0.5 rounded-sm">↓</kbd>{" "}
                to focus,{" "}
                <kbd className="bg-neutral-900 px-1 py-0.5 rounded-sm">
                  Enter
                </kbd>{" "}
                to select
              </span>
              <span>DevFlow. Command Control</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
