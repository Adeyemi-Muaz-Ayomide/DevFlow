"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AudioLines,
  Award,
  CheckCircle,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PomodoroMode } from "@/app/types/types";
import { useAppStore } from "@/app/store/useAppStore";

// interface FocusPageProps {
//   : {
//     minutes: number;
//     seconds: number;
//     isActive: boolean;
//     onToggle: () => void;
//     onReset: () => void;
//     mode: "focus" | "short_break" | "long_break";
//     setMode: (mode: PomodoroMode) => void;
//   };
// }

const FocusPage = () => {
  const [ambientMode, setAmbientMode] = useState(false);
  const [audioPreset, setAudioPreset] = useState("Alpha Waves Beats");
  const [isMuted, setIsMuted] = useState(true);
  const [totalSessionsToday, setTotalSessionsToday] = useState(3);
  const [latestSessionLog, setLatestSessionLog] = useState<string[]>([
    "14:25 - Work Block Finished (+150 XP)",
    "10:30 - Work Block Finished (+150 XP)",
  ]);
  // const pomodoroMode = useAppStore((state) => state.pomodoroMode);
  const pomodoroMode = useAppStore((s) => s.pomodoroMode);
  const minutes = useAppStore((s) => s.minutes);
  const seconds = useAppStore((s) => s.seconds);
  const toggleTimer = useAppStore((state) => state.toggleTimer);
  const stopTimer = useAppStore((state) => state.stopTimer);
  const resetTimer = useAppStore((state) => state.resetTimer);
  const isTimerActive = useAppStore((state) => state.isTimerActive);
  const setPomodoroMode = useAppStore((state) => state.setPomodoroMode);
  const setMinutes = useAppStore((state) => state.setMinutes);
  const setSeconds = useAppStore((state) => state.setSeconds);
  const addXP = useAppStore((state) => state.addXP);

  // Calculate percentage of timer
  const totalSecondsForMode =
    pomodoroMode === "focus"
      ? 25 * 60
      : pomodoroMode === "short_break"
        ? 5 * 60
        : 15 * 60;
  const currentRemainingSeconds = minutes * 60 + seconds;
  const percentageCompleted =
    ((totalSecondsForMode - currentRemainingSeconds) / totalSecondsForMode) *
    100;

  // Sound generator parameters
  const audioPresetsList = [
    "Alpha Waves Beats",
    "Cyberpunk Rain",
    "Deep Forest Rain",
    "Lo-Fi Space Static",
  ];

  // SVG parameters for standard donut ring
  const strokeRadius = 110;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset =
    strokeCircumference - (percentageCompleted / 100) * strokeCircumference;

  // Quick sound generator using modern audio context API for mock ambient beats
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  // const [noiseNode, setNoiseNode] = useState<
  //   AudioWorkletNode | ScriptProcessorNode | null
  // >(null);

  useEffect(() => {
    // Graceful cleanups for native synthesizers if loaded
    return () => {
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, [audioCtx]);

  const handleSoundToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      alert(
        `Playing mock premium ${audioPreset}. (Synthesizing ambient background loops internally)`,
      );
    }
  };

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((s) => s - 1);
        return;
      }

      if (minutes > 0) {
        setMinutes((m: number) => m - 1);
        setSeconds(59);
        return;
      }

      stopTimer();

      addXP(pomodoroMode === "focus" ? 150 : 50);

      resetTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isTimerActive,
    minutes,
    seconds,
    pomodoroMode,
    setMinutes,
    setSeconds,
    stopTimer,
    addXP,
    resetTimer,
  ]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className={`min-h-125 flex flex-col justify-between transition-colors duration-500 rounded-2xl ${
        ambientMode ? "bg-[#020202] border-0 p-0" : "bg-transparent space-y-8"
      }`}
      id="focus-workspace"
    >
      <AnimatePresence mode="wait">
        {ambientMode ? (
          /* AMBIENT MINIMALIST MODE */
          <motion.div
            key="ambient-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-1 flex flex-col items-center justify-center py-20 relative overflow-hidden"
            id="ambient-focused-container"
          >
            {/* Very faint glowing dynamic ambient backgrounds */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-500/5 blur-[120px] breathing" />

            {/* Exit ambient mode trigger */}
            <button
              onClick={() => setAmbientMode(false)}
              className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white rounded-lg text-xs font-mono transition-all cursor-pointer"
              title="Close ambient dashboard focus view"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Standard Mode</span>
            </button>

            {/* Core countdown and noise block */}
            <div className="text-center space-y-6 relative z-10">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">
                {pomodoroMode === "focus"
                  ? "Deep Focus Segment Active"
                  : "Relax Break Phase"}
              </span>

              <h1 className="text-8xl md:text-9xl font-mono font-bold text-white tracking-widest select-none leading-none">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h1>

              {/* Minimal controls row */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={toggleTimer}
                  className="px-6 py-2.5 bg-linear-to-r from-accent-purple to-accent-blue hover:from-purple-600 hover:to-blue-600 text-white font-sans text-xs font-bold rounded-lg transition-all shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  {isTimerActive ? "Pause Block" : "Resume Flow"}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2.5 bg-neutral-950 border border-zinc-800 hover:border-zinc-700 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Reset flow intervals"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Short audio control */}
              <button
                onClick={handleSoundToggle}
                className="flex items-center gap-2 px-4 py-2 mx-auto text-[10px] text-gray-400 font-mono hover:text-white transition-opacity bg-neutral-900/60 rounded-full border border-neutral-800"
              >
                {isMuted ? (
                  <VolumeX className="w-3 h-3 text-rose-400" />
                ) : (
                  <Volume2 className="w-3 h-3 text-green-400 breathing" />
                )}
                <span>
                  {audioPreset} {isMuted ? "(Muted)" : "(Sustained)"}
                </span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* STANDARD ADVANCED MODE */
          <motion.div
            key="advanced-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            id="focus-standard-container"
          >
            {/* Left section: Pomodoro Radial layout */}
            <div className="lg:col-span-2 bg-card-dark border border-card-border rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setAmbientMode(true)}
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-[#030304] border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-700 transition-colors rounded-lg text-xs font-mono cursor-pointer"
                title="Enter full ambient mode"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ambient Mode</span>
              </button>

              {/* Timer Progress Ring Ring Ring */}
              <div
                className="relative flex items-center justify-center my-6"
                id="pomodoro-radial-svg-wrap"
              >
                <svg className="w-64 h-64 -rotate-90">
                  {/* Background secondary border */}
                  <circle
                    cx="128"
                    cy="128"
                    r={strokeRadius}
                    className="stroke-[#111115]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Glowing active animated path */}
                  <motion.circle
                    cx="128"
                    cy="128"
                    r={strokeRadius}
                    className="stroke-accent-purple"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={strokeCircumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Inner labels and countdowns */}
                <div className="absolute flex flex-col items-center justify-center space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    {pomodoroMode === "focus" ? "Work Loop" : "Relax Loop"}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-widest leading-none select-none">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </h2>
                  <span className="text-[10px] bg-neutral-900 text-zinc-400 px-2 py-0.5 rounded-sm border border-neutral-800 font-mono">
                    {Math.round(percentageCompleted)}% Complete
                  </span>
                </div>
              </div>

              {/* Radial control buttons panel */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {/* Switch Modes tab row */}
                {["focus", "short_break", "long_break"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setPomodoroMode(m as PomodoroMode);
                      resetTimer();
                    }}
                    className={`px-3 py-1 text-[10px] font-mono rounded-md border capitalize transition-colors cursor-pointer ${
                      pomodoroMode === m
                        ? "text-accent-purple bg-purple-950/20 border-purple-800/40"
                        : "text-zinc-500 bg-neutral-950/60 border-transparent hover:text-zinc-300"
                    }`}
                  >
                    {m.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={toggleTimer}
                  className="px-6 py-2 bg-accent-purple text-xs text-white font-sans font-bold rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/10 flex items-center gap-2 cursor-pointer"
                >
                  {isTimerActive ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isTimerActive ? "Pause Session" : "Start Session"}
                  </span>
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2 bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Reset counter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right section: Focus Analytics, noise controls */}
            <div className="space-y-6">
              {/* Sound preset simulator */}
              <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                    <AudioLines className="w-4 h-4 text-purple-400" /> Focus
                    Ambient Noise
                  </span>
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-green-400 breathing" />
                  )}
                </div>

                <div className="space-y-2">
                  {audioPresetsList.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAudioPreset(preset);
                        setIsMuted(false);
                        alert(
                          `Loop shifted to simulated ${preset}. Playing noise streams.`,
                        );
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
                        audioPreset === preset && !isMuted
                          ? "bg-purple-950/10 border-accent-purple/30 text-white"
                          : "bg-neutral-900/40 border-neutral-800/80 text-zinc-400 hover:text-zinc-200 hover:border-neutral-700"
                      }`}
                    >
                      <span>{preset}</span>
                      {audioPreset === preset && !isMuted ? (
                        <span className="text-[10px] text-accent-purple font-mono">
                          ON Air
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-600 font-mono">
                          Select
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity track updates */}
              <div className="bg-card-dark border border-card-border rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Finished Work
                  Blocks
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded-lg text-center">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">
                        Blocks Today
                      </span>
                      <span className="text-lg font-bold text-gray-200 font-mono">
                        {totalSessionsToday} Slots
                      </span>
                    </div>
                    <div className="p-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded-lg text-center">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">
                        Active Score
                      </span>
                      <span className="text-lg font-bold text-accent-blue font-mono">
                        92% Gp
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5" id="focus-history-rows">
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                      Completed History Feed
                    </span>
                    {latestSessionLog.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-[10px] text-gray-400 font-mono py-1 border-b border-card-border/40"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FocusPage;
