"use client";
import { Search } from "lucide-react";
import UtilityItems from "../utility-item";
import { SidebarTrigger } from "./sidebar";
import { useEffect, useState } from "react";
import CommandPalette from "../commandpalette";

const SearchInput = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="-ml-1" />
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors w-full max-w-xs text-left cursor-pointer"
          id="toolbar-command-trigger"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1">Search workspace commands...</span>
          <kbd className="hidden sm:inline-flex px-1.5 py-0.2 bg-[#0c0c0e] border border-[#1e1e24] font-mono text-[9px] rounded-sm uppercase tracking-wide">
            ⌘K
          </kbd>
        </button>
      </div>
      <UtilityItems />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </header>
  );
};

export default SearchInput;
