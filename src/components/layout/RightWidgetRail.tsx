"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  Share2,
  Phone,
  Sparkles,
  ArrowRight,
  Droplet,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useSoundFX } from "@/context/SoundContext";
import { toast } from "sonner";

export function RightWidgetRail() {
  const { playPop, playTap } = useSoundFX();
  const sosAlerts = dataService.getSOSAlerts("active").slice(0, 1);
  const events = dataService.getEvents().slice(0, 2);

  const handleShareBatchInvite = () => {
    playPop();
    const text = encodeURIComponent(
      "🌟 Calling all Jawahar Navodaya Vidyalaya alumni & students! Join 'The Navodayan Network' Super App to connect across all 660+ JNVs, access 1-on-1 mentorship, blood emergency matching, and business hubs: https://navodayan.org"
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("WhatsApp Batch Blast opened!");
  };

  return (
    <aside className="hidden xl:block w-80 shrink-0 py-6 pl-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar space-y-6">
      {/* 1. Live Emergency SOS Ticker */}
      {sosAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Live SOS Alert
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
              Critical
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1">
            {sosAlerts[0].title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {sosAlerts[0].description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-rose-900/30">
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1">
              <Droplet className="w-3 h-3 text-rose-600 fill-rose-600" />
              {sosAlerts[0].required_blood_group ? `${sosAlerts[0].required_blood_group} Donors` : "Urgent"}
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${sosAlerts[0].contact_phone}`}
                onClick={playTap}
                className="p-1.5 text-xs font-semibold text-rose-700 bg-white dark:bg-rose-900/50 rounded-lg border border-rose-300 dark:border-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1"
                title="Call Immediately"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
              <Link
                href="/sos"
                onClick={playTap}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Help</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Upcoming Alumni Events */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Upcoming Meetups</span>
          </div>
          <Link
            href="/events"
            onClick={playTap}
            className="text-[11px] font-semibold text-navy-700 dark:text-blue-400 hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href="/events"
              onClick={playTap}
              className="block p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group"
            >
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-0.5">
                {new Date(ev.event_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} • {ev.mode === "online" ? "Virtual" : ev.city}
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-navy-700 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
                {ev.title}
              </h5>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{ev.rsvps_going} Going</span>
                <span>•</span>
                <span>{ev.category.replace("_", " ")}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Quick WhatsApp Batch Invite Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 shadow-xs text-center">
        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Share2 className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Invite Your Batchmates
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          The network grows stronger with every hostel roommate. Share the 1-tap invite link to your WhatsApp batch group!
        </p>
        <button
          onClick={handleShareBatchInvite}
          className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-97 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Send WhatsApp Invite</span>
        </button>
      </div>
    </aside>
  );
}
