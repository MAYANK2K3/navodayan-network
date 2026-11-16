"use client";

import React from "react";
import {
  Award,
  Sparkles,
  Quote,
  GraduationCap,
  Radio,
  ExternalLink,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useSoundFX } from "@/context/SoundContext";

export default function HallOfFamePage() {
  const { playTap } = useSoundFX();
  const legends = dataService.getHallOfFame();

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-navy-950 to-navy-900 text-white border border-amber-600/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>National Honors & Living Legends</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            The Navodaya Hall of Fame
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Honoring alumni who rose from rural government boarding schools to command space missions, lead national armed forces regiments, author life-saving public health policies, and build global enterprises.
          </p>
        </div>
      </div>

      {/* Legends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {legends.map((legend) => (
          <div
            key={legend.id}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Identity Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={legend.photo_url}
                  alt={legend.full_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 uppercase">
                    {legend.domain}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    {legend.full_name}
                  </h3>
                  <div className="text-xs font-semibold text-navy-700 dark:text-blue-400">
                    {legend.achievement_title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{legend.jnv_school_name} (&apos;{legend.passing_year})</span>
                  </div>
                </div>
              </div>

              {/* Story Summary */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {legend.story_summary}
              </p>

              {/* Quote */}
              {legend.quote && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 flex items-start gap-2.5">
                  <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs italic text-slate-600 dark:text-slate-300 font-serif leading-relaxed">
                    &ldquo;{legend.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 mt-4">
              <span className="font-mono text-[10px]">Verified Editorial Record</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>True Inspiration</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Campus Correspondents Spotlight */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white border border-navy-700 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Student Reporters & Campus Correspondents</span>
        </div>
        <h3 className="text-lg font-bold mb-2">Live from the Hostels</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
          Every JNV campus has student journalists reporting live science olympiad victories, regional sports meets, and teacher retirements directly to the Global Wall. Current students can apply during onboarding with their school ID.
        </p>
      </div>
    </div>
  );
}
