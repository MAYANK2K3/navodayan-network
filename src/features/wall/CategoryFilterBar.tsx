"use client";

import React from "react";
import { useSoundFX } from "@/context/SoundContext";
import { motion } from "framer-motion";

interface CategoryFilterBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilterBar({ activeCategory, onSelectCategory }: CategoryFilterBarProps) {
  const { playTap } = useSoundFX();

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "memories", label: "Hostel Memories" },
    { id: "achievements", label: "Achievements" },
    { id: "campus_live", label: "Campus Live" },
    { id: "safe_space", label: "The Real Talk (Safe Space)" },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-1.5 min-w-max p-1 bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-white/10 rounded-2xl">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playTap();
                onSelectCategory(cat.id);
              }}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "text-navy-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-xs border border-slate-200/60 dark:border-zinc-700 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
