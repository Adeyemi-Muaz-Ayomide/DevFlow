"use client";
import { MOCK_CALENDAR_EVENTS } from "@/app/data/mockData";
import { CalendarEvent } from "@/app/types/types";
import { Calendar as CalendarIcon } from "lucide-react";
import { Briefcase, Clock, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const Calendar = () => {
  const [filterType, setFilterType] = useState<
    "all" | "meeting" | "focus" | "deadline"
  >("all");
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [selectedDayEvent, setSelectedDayEvent] =
    useState<CalendarEvent | null>(events[0]);

  // June 2026 parameters (Starting June 1st, 2026 - which is a Monday!)
  const totalDaysInMonth = 30;
  const daysHeader = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const filterOptions: Array<"all" | "meeting" | "focus" | "deadline"> = [
    "all",
    "meeting",
    "focus",
    "deadline",
  ];

  // Toggle calendar cell checkbox completion markers
  const toggleEventCompleted = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === id ? { ...evt, completed: !evt.completed } : evt,
      ),
    );
    // Sync active selection details panel
    if (selectedDayEvent?.id === id) {
      setSelectedDayEvent((prev) =>
        prev ? { ...prev, completed: !prev.completed } : null,
      );
    }
  };

  // const toggleEventCompleted = (id: string) => {
  //   setEvents(
  //     events.map((evt) =>
  //       evt.id === id ? { ...evt, completed: !evt.completed } : evt,
  //     ),
  //   );

  //   // Sync active selection details panel
  //   if (selectedDayEvent?.id === id) {
  //     setSelectedDayEvent(
  //       selectedDayEvent
  //         ? {
  //             ...selectedDayEvent,
  //             completed: !selectedDayEvent.completed,
  //           }
  //         : null,
  //     );
  //   }
  // };

  // Add mock calendar event
  const handleAddMockEvent = () => {
    const fresh: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: "Sprint Retrospective Meeting",
      start: "16:00",
      date: "2026-06-03",
      duration: "1h",
      type: "meeting",
      completed: false,
    };
    setEvents((prev) => [...prev, fresh]);
    alert("Synthesized mock Retrospective synced to calendar. Enjoy!");
  };

  const filteredEvents =
    filterType === "all" ? events : events.filter((e) => e.type === filterType);

  // Helper colors for different calendar events
  const getEventBadgeColor = (
    type: "meeting" | "focus" | "deadline" | "personal",
  ) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "focus":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "deadline":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/10";
    }
  };

  // Helper checker to find if calendar cells should render indicators of events
  const getEventsForDay = (dayNum: number) => {
    const formattedDate = `2026-06-${String(dayNum).padStart(2, "0")}`;
    return events.filter((e) => e.date === formattedDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      id="calendar-page-layout-wrapper"
    >
      {/* 1. LEFT MAIN COLUMN: Calendar month grid */}
      <div className="lg:col-span-2 bg-card-dark border border-card-border p-5 rounded-xl space-y-4">
        {/* Navigation toolbar header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-neutral-900 border border-neutral-800 text-purple-400 rounded-lg">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-gray-200">
                June 2026 Workspace
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">
                Current Calendar View
              </p>
            </div>
          </div>

          {/* Filtering buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterOptions.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2 py-0.5 rounded-sm border text-[9px] font-mono capitalize transition-all cursor-pointer ${
                  filterType === type
                    ? "text-accent-purple bg-purple-950/20 border-purple-800/30"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Days of week header row */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-zinc-500 font-mono py-1">
          {daysHeader.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar days grid (June 2026 begins on Mon, June 1st) */}
        <div className="grid grid-cols-7 gap-2" id="calendar-days-grid-cells">
          {Array.from({ length: totalDaysInMonth }).map((_, index) => {
            const dayNum = index + 1;
            const dayEvents = getEventsForDay(dayNum);

            return (
              <button
                key={index}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    setSelectedDayEvent(dayEvents[0]);
                  }
                }}
                className={`aspect-square w-full rounded-lg bg-[#040406]/60 border border-card-border/60 hover:border-neutral-800 transition-colors p-1.5 flex flex-col justify-between items-start text-left relative overflow-hidden group cursor-pointer ${
                  dayEvents.length > 0 ? "shadow-inner border-neutral-800" : ""
                }`}
                id={`calendar-day-cell-${dayNum}`}
              >
                {/* Day label */}
                <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-200">
                  {dayNum}
                </span>

                {/* Day events indicator squares/lines */}
                <div className="w-full flex items-center gap-1 overflow-hidden h-1">
                  {dayEvents.map((e) => (
                    <span
                      key={e.id}
                      className={`h-1 w-full rounded-full shrink-0 ${
                        e.type === "meeting"
                          ? "bg-blue-400"
                          : e.type === "focus"
                            ? "bg-purple-400"
                            : "bg-rose-400"
                      }`}
                      title={e.title}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT SIDEBAR COLUMN: Event details + upcoming logs */}
      <div className="space-y-6">
        {/* Selected Event Details Area */}
        <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-card-border/40">
            <h3 className="text-xs font-semibold text-gray-200">
              Selected Event Info
            </h3>
            <button
              onClick={handleAddMockEvent}
              className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-white rounded-md text-[9px] font-mono cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Event
            </button>
          </div>

          {selectedDayEvent ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDayEvent.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <span
                    className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded-sm border ${getEventBadgeColor(selectedDayEvent.type)}`}
                  >
                    {selectedDayEvent.type}
                  </span>
                  <p className="text-xs font-sans font-semibold text-gray-200">
                    {selectedDayEvent.title}
                  </p>
                </div>

                <div className="space-y-1.5 text-[10px] text-zinc-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>
                      Calculated Schedule:{" "}
                      <strong>{selectedDayEvent.start}</strong> (
                      {selectedDayEvent.duration})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>
                      Target Date: <strong>{selectedDayEvent.date}</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleEventCompleted(selectedDayEvent.id)}
                  className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedDayEvent.completed
                      ? "bg-green-950/20 text-green-400 border-green-900/30 hover:bg-green-950/40"
                      : "bg-[#050508] text-gray-300 border-neutral-800 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  {selectedDayEvent.completed
                    ? "✓ Checked & Completed Task"
                    : "✓ Mark ticket as complete"}
                </button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-[10px] text-zinc-600 font-mono text-center py-6">
              Select a highlighted day cell to audit event parameters.
            </p>
          )}
        </div>

        {/* List of general monthly agenda events */}
        <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-gray-200">
            Active Month Agenda
          </h3>

          <div
            className="space-y-2.5 max-h-47.5 overflow-y-auto pr-1"
            id="agenda-monthly-list"
          >
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedDayEvent(evt)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  evt.completed
                    ? "bg-neutral-900/30 border-neutral-800/40 opacity-70"
                    : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                    {evt.date.split("-").slice(1).join("/")}
                  </span>
                  <h4
                    className={`text-[11px] font-sans font-medium text-gray-300 truncate ${evt.completed ? "line-through text-zinc-600" : ""}`}
                  >
                    {evt.title}
                  </h4>
                </div>
                <span
                  className={`text-[8px] tracking-wide font-mono px-1 rounded-sm border shrink-0 ${getEventBadgeColor(evt.type)}`}
                >
                  {evt.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
