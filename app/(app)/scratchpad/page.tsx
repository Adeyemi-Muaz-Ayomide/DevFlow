"use client";
import React, { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { Note } from "@/app/types/types";
import { INITIAL_NOTES } from "@/app/data/mockData";
import {
  BookmarkCheck,
  Eye,
  FileText,
  PenTool,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";

const ScratchPad = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    notes[0]?.id || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editMode, setEditMode] = useState<"write" | "preview">("write");

  // Get active note
  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  // Unique categories helper
  const categories = [
    "All",
    ...Array.from(new Set(notes.map((n) => n.category))),
  ];

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle note fields updates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateActiveNoteField = (field: keyof Note, value: any) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? {
              ...n,
              [field]: value,
              // auto-generate short snippet if updating body content
              ...(field === "content"
                ? { snippet: value.slice(0, 100) + "..." }
                : {}),
            }
          : n,
      ),
    );
  };

  // Add new notebook note
  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Code Reference",
      snippet: "Start entering core markdown documentation parameters...",
      content: `# Untitled Code Reference

Customize this text area with essential codes, architecture guidelines, or sprint diaries.

## Codes Mockup
\`\`\`typescript
const logDiagnostics = (cluster: string) => {
  console.log(\`Cluster connected: \${cluster}\`);
};
\`\`\`
`,
      category: "Documentation",
      updatedAt: "Just Now",
      isFavorite: false,
      tags: ["Draft", "Sandbox"],
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setEditMode("write");
  };

  // Delete notebook note
  const handleDeleteNote = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedNoteId === id && remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 h-145 items-stretch"
      id="notes-workspace"
    >
      {/* 1. LEFT COLUMN: Directory Search & Feed Selection */}
      <div className="bg-card-dark border border-card-border rounded-xl flex flex-col overflow-hidden h-full">
        {/* Header toolbar */}
        <div className="p-3 border-b border-card-border bg-[#050507] flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-200">
            Notes Directory
          </span>
          <button
            onClick={handleCreateNote}
            className="p-1 px-2.5 bg-accent-purple/20 text-accent-purple border border-purple-900/30 hover:border-purple-800/40 hover:bg-accent-purple/30 text-[10px] font-mono rounded-md flex items-center gap-1.5 cursor-pointer"
            id="create-note-button"
            title="Create quick markdown notebook entry"
          >
            <Plus className="w-3 h-3" /> Note
          </button>
        </div>

        {/* Search input cell */}
        <div className="p-3 border-b border-card-border/60 bg-neutral-900/10 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-xs text-gray-200 outline-hidden placeholder-gray-600 font-sans"
            placeholder="Query keyword filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category filtering row */}
        <div
          className="px-3 py-2 border-b border-card-border/40 flex gap-1.5 overflow-x-auto select-none shrink-0 scrollbar-none"
          id="categories-scroller"
        >
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-sm text-[9px] font-mono border transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "text-accent-purple bg-purple-950/20 border-purple-800/30"
                  : "text-zinc-500 hover:text-zinc-300 border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scrollable list of notebook logs */}
        <div
          className="flex-1 overflow-y-auto divide-y divide-card-border/50 p-2 space-y-1"
          id="notes-scrollable-feed"
        >
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-[10px] text-gray-500 font-mono">
              No matching note logs found.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const worksAsSelected = note.id === selectedNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border text-left flex flex-col gap-1 ${
                    worksAsSelected
                      ? "bg-neutral-900/90 border-neutral-800 text-white"
                      : "bg-transparent border-transparent text-gray-400 hover:bg-neutral-900/30"
                  }`}
                  id={`note-cell-${note.id}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h4
                      className={`text-xs font-semibold truncate ${worksAsSelected ? "text-white" : "text-gray-300"}`}
                    >
                      {note.title}
                    </h4>
                    {note.isFavorite && (
                      <Star className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
                    )}
                  </div>

                  <p className="text-[10px] text-gray-500 line-clamp-1 leading-relaxed">
                    {note.snippet}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-600">
                    <span>{note.updatedAt}</span>

                    {/* <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-rose-400 cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. RIGHT COLUMN(S): Rich Active Editor Area / Previews */}
      <div
        className="md:col-span-2 bg-card-dark border border-card-border rounded-xl flex flex-col overflow-hidden h-full"
        id="active-note-editor-wrapper"
      >
        {activeNote ? (
          <>
            {/* Editor header status */}
            <div className="p-3 border-b border-card-border bg-[#050507] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-accent-purple shrink-0" />
                <input
                  type="text"
                  className="bg-transparent text-xs font-semibold text-gray-200 outline-hidden border-b border-transparent focus:border-neutral-800 py-0.5 truncate w-full"
                  value={activeNote.title}
                  onChange={(e) =>
                    updateActiveNoteField("title", e.target.value)
                  }
                  placeholder="Note Title"
                />
              </div>

              {/* Toolbar togglers */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    updateActiveNoteField("isFavorite", !activeNote.isFavorite)
                  }
                  className="p-1.5 rounded-md hover:bg-neutral-800 text-gray-400 hover:text-amber-500 transition-colors"
                  title="Favorite reference log"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${activeNote.isFavorite ? "fill-amber-500 text-amber-500" : ""}`}
                  />
                </button>

                <div className="bg-neutral-900 border border-neutral-800 p-0.5 rounded-md flex items-center">
                  <button
                    onClick={() => setEditMode("write")}
                    className={`px-2 py-1 text-[9px] font-mono rounded-xs flex items-center gap-1 ${
                      editMode === "write"
                        ? "bg-accent-purple text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <PenTool className="w-2.5 h-2.5" /> MD Code
                  </button>
                  <button
                    onClick={() => setEditMode("preview")}
                    className={`px-2 py-1 text-[9px] font-mono rounded-xs flex items-center gap-1 ${
                      editMode === "preview"
                        ? "bg-accent-purple text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Eye className="w-2.5 h-2.5" /> Previewer
                  </button>
                </div>
              </div>
            </div>

            {/* Editing Work area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {editMode === "write" ? (
                  <motion.textarea
                    key="write-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full p-4 bg-transparent outline-hidden resize-none text-zinc-300 font-mono text-xs leading-relaxed focus:ring-0"
                    placeholder="Enter document layout with raw markdown annotations..."
                    value={activeNote.content}
                    onChange={(e) =>
                      updateActiveNoteField("content", e.target.value)
                    }
                  />
                ) : (
                  <motion.div
                    key="preview-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full p-6 overflow-y-auto text-zinc-300 font-sans text-xs space-y-4 leading-relaxed"
                  >
                    {/* Simplified hand-parsed Markdown elements rendering to look hyper premium */}
                    <div
                      className="space-y-4"
                      id="premium-markdown-custom-parser"
                    >
                      <div className="border-b border-card-border/80 pb-2">
                        <span className="text-[9px] font-mono text-accent-purple uppercase tracking-widest block">
                          Reference Segment Category: {activeNote.category}
                        </span>
                        <h1 className="text-sm font-bold text-white mt-1 uppercase tracking-tight">
                          {activeNote.title}
                        </h1>
                      </div>

                      {activeNote.content.split("\n\n").map((para, index) => {
                        if (para.startsWith("# ")) {
                          return (
                            <h2
                              key={index}
                              className="text-xs font-bold text-gray-100 border-l-2 border-accent-purple pl-2 pt-2"
                            >
                              {para.replace("# ", "")}
                            </h2>
                          );
                        }
                        if (para.startsWith("## ")) {
                          return (
                            <h3
                              key={index}
                              className="text-xs font-semibold text-gray-200 pt-1"
                            >
                              {para.replace("## ", "")}
                            </h3>
                          );
                        }
                        if (para.startsWith("```")) {
                          const lines = para
                            .split("\n")
                            .filter((l) => !l.startsWith("```"));
                          return (
                            <pre
                              key={index}
                              className="bg-[#030304] border border-neutral-800 p-3 rounded-lg overflow-x-auto text-[11px] font-mono text-accent-blue font-semibold"
                            >
                              <code>{lines.join("\n")}</code>
                            </pre>
                          );
                        }
                        if (para.startsWith("- ")) {
                          return (
                            <ul
                              key={index}
                              className="list-disc pl-4 space-y-1 text-zinc-400"
                            >
                              {para.split("\n").map((li, liIdx) => (
                                <li key={liIdx}>{li.replace("- ", "")}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={index} className="text-zinc-400">
                            {para}
                          </p>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Note details footer tags */}
            <div className="p-3 border-t border-card-border bg-[#050510]/10 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <div className="flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-accent-purple" />
                <span>Doc Category:</span>
                <input
                  type="text"
                  className="bg-transparent outline-hidden border-b border-transparent focus:border-zinc-800 px-1 py-0.2 text-zinc-300 w-24 text-[10px]"
                  value={activeNote.category}
                  onChange={(e) =>
                    updateActiveNoteField("category", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center gap-1.5">
                {activeNote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.2 bg-neutral-900 border border-neutral-800 text-[9px] text-zinc-400 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-xs text-gray-500 font-mono">
            Create or select a reference notebook from the left scroll pane.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ScratchPad;
