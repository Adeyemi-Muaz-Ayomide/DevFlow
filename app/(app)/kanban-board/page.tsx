"use client";
import { useState, DragEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MOCK_ASSIGNEES } from "@/app/data/mockData";
import { Task, TaskStatus, TaskPriority } from "@/app/types/types";
import { Info, Plus } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/app/store/useAppStore";
import updateTasks from "@/app/utils/taskHelpers";

const KanbanBoard = () => {
  const tasks = useAppStore((state) => state.tasks);
  const setTasks = useAppStore((state) => state.setTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<TaskStatus | null>(
    null,
  );

  // Quick Add task form state
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newStatus, setNewStatus] = useState<TaskStatus>("todo");
  const [newTags, setNewTags] = useState("");
  const [newAssignee, setNewAssignee] =
    useState<keyof typeof MOCK_ASSIGNEES>("alex");
  const [newPoints, setNewPoints] = useState(3);

  const columns: { id: TaskStatus; label: string; color: string }[] = [
    {
      id: "backlog",
      label: "Backlog",
      color: "bg-zinc-600/30 border-zinc-700/50",
    },
    { id: "todo", label: "Todo", color: "bg-blue-500/10 border-blue-500/20" },
    {
      id: "in_progress",
      label: "In Progress",
      color: "bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "review",
      label: "In Review",
      color: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "completed",
      label: "Completed",
      color: "bg-green-500/10 border-green-500/20",
    },
  ];

  // Drag handlers
  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setActiveDropColumn(status);
  };

  const handleDrop = (e: DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task,
    );

    setTasks(updatedTasks);

    if (taskId) {
      setTasks(
        updateTasks(tasks, (task) =>
          task.id === taskId ? { ...task, status } : task,
        ),
      );
    }
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  // Move task via standard context clicks (highly accessible fallback)
  const handleMoveStatus = (taskId: string, targetStatus: TaskStatus) => {
    setTasks(
      updateTasks(tasks, (task) =>
        task.id === taskId ? { ...task, status: targetStatus } : task,
      ),
    );
  };

  // Add new task
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: newDesc || "No supplementary description is loaded.",
      priority: newPriority,
      status: newStatus,
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : ["Quick Tag"],
      assignee: MOCK_ASSIGNEES[newAssignee],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      storyPoints: Number(newPoints),
    };

    setTasks([added, ...tasks]);

    // Reset inputs
    setNewTitle("");
    setNewDesc("");
    setNewTags("");
    setShowAddDrawer(false);
  };

  // Helper icons for priorities
  const getPriorityBadgeColor = (p: TaskPriority) => {
    switch (p) {
      case "urgent":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "low":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/10";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      // exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
      id="kanban-board-page"
    >
      {/* Board Header Actions */}
      <div className=" my-6 mx-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <h2 className="text-lg font-sans font-bold text-white tracking-tight flex items-center gap-2">
            Kanban Board /{" "}
            <span className="text-gray-400 font-medium">Sprint Workspace</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Reorder tasks smoothly by dragging them or click the context arrows
            to transition status.
          </p>
        </div>

        <button
          onClick={() => setShowAddDrawer(true)}
          className="px-3.5 py-1.5 bg-accent-purple text-xs text-white font-sans font-medium rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 cursor-pointer relative overflow-hidden shrink-0"
          id="trigger-add-task-drawer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task Ticket</span>
        </button>
      </div>

      {/* Columns Container */}
      <div
        className=" my-6 mx-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start"
        id="kanban-columns-scroller"
      >
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          const pointsSum = columnTasks.reduce(
            (acc, curr) => acc + (curr.storyPoints || 0),
            0,
          );
          const isOver = activeDropColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragLeave={() => setActiveDropColumn(null)}
              className={`flex flex-col bg-card-dark/40 rounded-xl border border-card-border/80 transition-all duration-200 shrink-0 select-none min-h-120 p-2.5 ${
                isOver ? "bg-purple-950/5 border-purple-500/20" : ""
              }`}
              id={`kanban-col-${col.id}`}
            >
              {/* Column Header */}
              <div
                className="flex items-center justify-between px-2 py-1.5 mb-3"
                id={`col-header-${col.id}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      col.id === "backlog"
                        ? "bg-zinc-500"
                        : col.id === "todo"
                          ? "bg-blue-400"
                          : col.id === "in_progress"
                            ? "bg-purple-500"
                            : col.id === "review"
                              ? "bg-amber-400"
                              : "bg-green-500"
                    }`}
                  />
                  <h4 className="text-xs font-sans font-semibold text-gray-200 truncate">
                    {col.label}
                  </h4>
                  <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-gray-500 px-1.5 py-0.2 rounded-sm font-mono leading-none">
                    {columnTasks.length}
                  </span>
                </div>

                {pointsSum > 0 && (
                  <span
                    className="text-[10px] text-gray-500 font-mono"
                    title="Total Story Points"
                  >
                    {pointsSum} SPs
                  </span>
                )}
              </div>

              {/* Task Items Space */}
              <div
                className="space-y-2 flex-1"
                id={`col-cards-container-${col.id}`}
              >
                {columnTasks.length === 0 ? (
                  <div className="border border-dashed border-neutral-800/60 rounded-lg py-8 text-center text-[10px] text-gray-500 font-mono">
                    Empty Drop Column
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      draggable
                      // onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragStart={(e) =>
                        handleDragStart(e as unknown as DragEvent, task.id)
                      }
                      onDragEnd={handleDragEnd}
                      whileHover={{ scale: 1.01, y: -1 }}
                      className="bg-card-dark border border-card-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-neutral-800 transition-shadow group relative overflow-hidden"
                      id={`kanban-card-${task.id}`}
                    >
                      {/* Priority, tags & story points */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded-xs border ${getPriorityBadgeColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>

                        {task.storyPoints !== undefined && (
                          <span className="text-[9px] bg-neutral-900 text-zinc-500 px-1.5 py-0.2 rounded-xs border border-neutral-800/60 font-mono font-medium">
                            {task.storyPoints} pts
                          </span>
                        )}
                      </div>

                      {/* Content Title */}
                      <h4 className="text-xs font-semibold text-gray-200 mb-1 group-hover:text-white transition-colors leading-relaxed">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {task.description}
                      </p>

                      {/* Footer assignees & action links */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-card-border/60">
                        {/* Assignee pill */}
                        <div
                          className="flex items-center gap-1.5 min-w-0"
                          title={`${task.assignee.name} (${task.assignee.role})`}
                        >
                          <Image
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            width={16}
                            height={16}
                            className="w-4 h-4 rounded-full border border-neutral-800 object-cover"
                          />
                          <span className="text-[9px] text-zinc-400 truncate font-sans">
                            {task.assignee.name.split(" ")[0]}
                          </span>
                        </div>

                        {/* Fast Shift drop menu */}
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {columns
                            .filter((c) => c.id !== col.id)
                            .slice(0, 2)
                            .map((targetCol) => (
                              <button
                                key={targetCol.id}
                                onClick={() =>
                                  handleMoveStatus(task.id, targetCol.id)
                                }
                                className="text-[10px] text-zinc-400 hover:text-accent-purple hover:bg-neutral-900 border border-transparent hover:border-neutral-800 px-1 py-0.5 rounded-sm cursor-pointer font-mono"
                                title={`Shift ticket to ${targetCol.label}`}
                              >
                                →
                              </button>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Quick Add Ticket Sliding Drawer */}
      <AnimatePresence>
        {showAddDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDrawer(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
              id="ticket-drawer-backdrop"
            />

            {/* Sliding Drawer body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card-dark border-l border-card-border p-6 shadow-2xl z-60 flex flex-col justify-between overflow-y-auto"
              id="ticket-drawer-container"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-card-border pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Create Quick Development Task
                    </h3>
                    <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                      Inject an immediate card Ticket into DevFlow&apos;s Kanban
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddDrawer(false)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer text-sm font-mono bg-neutral-900 border border-neutral-800 px-2 py-1 rounded"
                  >
                    Close
                  </button>
                </div>

                <form
                  onSubmit={handleAddTask}
                  className="space-y-4"
                  id="ticket-drawer-form"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                      Ticket Title
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-200 outline-hidden focus:border-purple-500"
                      placeholder="e.g. Optimize React rendering pools"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                      Description / Context
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-300 outline-hidden focus:border-purple-500"
                      placeholder="e.g. Spikes are happening during local state hooks loading..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                        Category State
                      </label>
                      <select
                        className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-300 outline-hidden focus:border-purple-500"
                        value={newStatus}
                        onChange={(e) =>
                          setNewStatus(e.target.value as TaskStatus)
                        }
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                        Priority Rank
                      </label>
                      <select
                        className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-300 outline-hidden focus:border-purple-500"
                        value={newPriority}
                        onChange={(e) =>
                          setNewPriority(e.target.value as TaskPriority)
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                        Points Estimation
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="13"
                        className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-300 outline-hidden focus:border-purple-500"
                        value={newPoints}
                        onChange={(e) => setNewPoints(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                        Assignee node
                      </label>
                      <select
                        className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-300 outline-hidden focus:border-purple-500"
                        value={newAssignee}
                        onChange={(e) =>
                          setNewAssignee(
                            e.target.value as keyof typeof MOCK_ASSIGNEES,
                          )
                        }
                      >
                        {Object.entries(MOCK_ASSIGNEES).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                      Custom Tags (Comma Separated)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#040406] border border-card-border rounded-lg text-xs p-2.5 text-gray-300 outline-hidden focus:border-purple-500"
                      placeholder="Vercel, Middleware, CSS"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-accent-purple hover:bg-purple-600 text-white font-sans font-semibold rounded-lg text-xs tracking-wide transition-colors mt-4 cursor-pointer"
                  >
                    Commit Ticket to Board
                  </button>
                </form>
              </div>

              <div className="border-t border-card-border/60 pt-4 mt-8 flex items-start gap-2.5 text-[10px] text-gray-500 font-sans leading-relaxed">
                <Info className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                <span>
                  Creating tickets instantly updates client state context. No
                  server databases are impacted by these testing procedures.
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KanbanBoard;
