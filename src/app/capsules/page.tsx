"use client";

import React, { useState } from "react";
import {
  Clock,
  Lock,
  Unlock,
  Sparkles,
  Plus,
  BookOpen,
  Calendar,
  Heart,
  Share2,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { TimeCapsule } from "@/types";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function TimeCapsulesPage() {
  const { user, requireAuth } = useAuth();
  const { playPop, playTap, playSuccess } = useSoundFX();

  const [capsules, setCapsules] = useState<TimeCapsule[]>(() =>
    dataService.getTimeCapsules()
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [capsuleTitle, setCapsuleTitle] = useState("");
  const [batchYear, setBatchYear] = useState<number>(user?.passing_year || 2018);
  const [unlockDate, setUnlockDate] = useState("");
  const [dormStory, setDormStory] = useState("");
  const [messMemory, setMessMemory] = useState("");
  const [slang, setSlang] = useState("");
  const [batchSecret, setBatchSecret] = useState("");

  const handleToggleUnlock = (id: string) => {
    playSuccess();
    const updated = dataService.toggleCapsuleUnlock(id);
    if (updated) {
      setCapsules((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (updated.is_unlocked) {
        toast.success("Time Capsule unlocked! Welcome back to your batch memories.");
        try {
          confetti({ particleCount: 90, spread: 70 });
        } catch {
          // Ignore
        }
      } else {
        toast.info("Capsule re-sealed in time locker.");
      }
    }
  };

  const handleCreateCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      const newCap = dataService.createTimeCapsule({
        title: capsuleTitle,
        batch_year: Number(batchYear),
        unlock_date: unlockDate ? new Date(unlockDate).toISOString() : new Date(Date.now() + 86400000 * 365).toISOString(),
        memories_json: {
          dorm_stories: dormStory ? [dormStory] : ["Midnight hostel adventures!"],
          mess_memories: messMemory ? [messMemory] : ["Sunday morning special breakfast."],
          famous_slang: slang ? slang.split(",").map((s) => s.trim()) : ["Fighter", "Guru Ji"],
          batch_secrets: batchSecret ? [batchSecret] : ["Our hidden farewell notes."],
        },
      });

      playSuccess();
      toast.success("Batch Time Capsule sealed into the digital vault!");
      setCapsules((prev) => [newCap, ...prev]);
      setIsCreateModalOpen(false);
      setCapsuleTitle("");
      setDormStory("");
      setMessMemory("");
      setSlang("");
      setBatchSecret("");
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Nostalgia Vaults & Digital Batch Lockers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Digital Time Capsules
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Seal your batch memories, hostel slangs, and graduation ambitions into encrypted digital time vaults. Revisit them on your 5-year, 10-year, or silver jubilee reunion!
            </p>
          </div>

          <button
            onClick={() => {
              playTap();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-amber-400 hover:bg-amber-300 active:scale-95 shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Seal a Capsule</span>
          </button>
        </div>
      </div>

      {/* Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {capsules.map((cap) => {
          const isUnlocked = cap.is_unlocked;
          const unlockTime = new Date(cap.unlock_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={cap.id}
              className={`p-6 rounded-3xl border shadow-xs transition-all flex flex-col justify-between ${
                isUnlocked
                  ? "bg-amber-50/40 dark:bg-zinc-900 border-amber-300/80 dark:border-amber-900/40"
                  : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-white/10"
              }`}
            >
              <div>
                {/* Vault Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-navy-50 dark:bg-navy-950 text-navy-800 dark:text-blue-300 border border-navy-200/60 dark:border-navy-800/60 uppercase">
                    {cap.school_name}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isUnlocked
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Unlock className="w-3 h-3" />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Sealed Until {unlockTime}</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-1">
                  {cap.title}
                </h3>

                <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Class of {cap.batch_year} • Sealed by {cap.creator_name}
                </div>

                {/* Content: If Unlocked, show memory sections; if locked, show teaser */}
                {isUnlocked ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-zinc-800/70 border border-amber-200/70 dark:border-amber-900/30 text-xs">
                    <div>
                      <div className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Dormitory Stories</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                        {cap.memories_json.dorm_stories.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>Mess & Dining Memories</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                        {cap.memories_json.mess_memories.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                        Batch Slangs
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cap.memories_json.famous_slang.map((sl) => (
                          <span
                            key={sl}
                            className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-zinc-700 text-amber-800 dark:text-amber-300 font-semibold text-[10px]"
                          >
                            &quot;{sl}&quot;
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-dashed border-slate-200 dark:border-zinc-700 text-center space-y-2">
                    <Lock className="w-6 h-6 mx-auto text-amber-500" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This locker is encrypted until {unlockTime}. Use the Demo Preview toggle below to inspect the unlocked memories immediately.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Toggle */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs mt-4">
                <span className="text-[11px] text-slate-400 font-mono">
                  Locker ID: {cap.id}
                </span>

                <button
                  onClick={() => handleToggleUnlock(cap.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-xs ${
                    isUnlocked
                      ? "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      : "bg-navy-800 text-white hover:bg-navy-900 active:scale-95"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUnlocked ? "Re-seal Locker" : "Demo Preview Unlock"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seal Capsule Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Seal a Batch Time Capsule
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCapsule} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Capsule Title
                  </label>
                  <input
                    type="text"
                    required
                    value={capsuleTitle}
                    onChange={(e) => setCapsuleTitle(e.target.value)}
                    placeholder="e.g. Class of 2018: The Midnight Maggi Vault"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Batch Year
                    </label>
                    <input
                      type="number"
                      required
                      value={batchYear}
                      onChange={(e) => setBatchYear(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Scheduled Unlock Date
                    </label>
                    <input
                      type="date"
                      required
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unforgettable Dormitory Story
                  </label>
                  <textarea
                    rows={2}
                    value={dormStory}
                    onChange={(e) => setDormStory(e.target.value)}
                    placeholder="The time during winter prep when..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mess / Dining Memory
                  </label>
                  <input
                    type="text"
                    value={messMemory}
                    onChange={(e) => setMessMemory(e.target.value)}
                    placeholder="Sunday morning kheer sprint or egg trading..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Famous Batch Slang (comma separated)
                  </label>
                  <input
                    type="text"
                    value={slang}
                    onChange={(e) => setSlang(e.target.value)}
                    placeholder="Fighter, Topper Saab, Chhupa Rustam"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl"
                  >
                    Seal into Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
