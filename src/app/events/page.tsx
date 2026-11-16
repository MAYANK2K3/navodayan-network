"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  ExternalLink,
  Check,
  Star,
  Share2,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { EventItem } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const { user, requireAuth } = useAuth();
  const { playPop, playTap, playSuccess } = useSoundFX();

  const [events, setEvents] = useState<EventItem[]>(() => dataService.getEvents());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventMode, setEventMode] = useState<"online" | "offline">("offline");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCity, setEventCity] = useState(user?.current_city || "Bengaluru");
  const [eventCategory, setEventCategory] = useState<EventItem["category"]>("city_meetup");

  const filtered = events.filter(
    (e) => activeCategory === "all" || e.category === activeCategory
  );

  const handleRSVP = (eventId: string, status: "going" | "interested" | "not_going") => {
    requireAuth(() => {
      playSuccess();
      const updated = dataService.rsvpEvent(eventId, status);
      if (updated) {
        setEvents((prev) => prev.map((e) => (e.id === eventId ? updated : e)));
        toast.success(`RSVP updated to ${status === "going" ? "Going! See you there" : status}!`);
      }
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      const newEv = dataService.createEvent({
        title: eventTitle,
        description: eventDescription,
        event_date: eventDate ? new Date(eventDate).toISOString() : new Date().toISOString(),
        mode: eventMode,
        location_or_link: eventLocation,
        city: eventCity,
        category: eventCategory,
      });

      playSuccess();
      toast.success("Event created and broadcasted to community calendar!");
      setEvents((prev) => [newEv, ...prev]);
      setIsCreateModalOpen(false);
      setEventTitle("");
      setEventDescription("");
    });
  };

  const handleShareEvent = (ev: EventItem) => {
    playPop();
    const text = encodeURIComponent(
      `📅 You're invited to "${ev.title}" on ${new Date(ev.event_date).toLocaleDateString()} (${ev.mode === "online" ? "Virtual" : ev.city})! RSVP on The Navodayan Network: https://navodayan.org/events`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("Event invite shared on WhatsApp!");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>National & Regional Gatherings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Meetups, Webinars & Reunions
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              From city coffee catchups to batch silver jubilees and career webinars. RSVP to stay in touch with your batch and chapter.
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
            <span>Host a Meetup</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Gatherings" },
          { id: "city_meetup", label: "City Chapters" },
          { id: "career_webinar", label: "Career Webinars" },
          { id: "reunion", label: "Batch Reunions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playTap();
              setActiveCategory(tab.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCategory === tab.id
                ? "bg-navy-800 text-white shadow-xs"
                : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Stream */}
      <div className="space-y-4">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
                  {ev.category.replace("_", " ")}
                </span>
                <span className="text-xs font-bold text-navy-800 dark:text-blue-300">
                  {new Date(ev.event_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-slate-300 dark:text-zinc-700">•</span>
                <span className="text-xs text-slate-500">
                  {ev.mode === "online" ? "Virtual (Online)" : ev.city}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {ev.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {ev.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>{ev.rsvps_going} Going</span>
                </span>
                <span>•</span>
                <span>{ev.rsvps_interested} Interested</span>
                <span>•</span>
                <span>Organized by {ev.creator_name}</span>
              </div>
            </div>

            {/* RSVP Controls */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRSVP(ev.id, "going")}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    ev.user_rsvp === "going"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Going</span>
                </button>

                <button
                  onClick={() => handleRSVP(ev.id, "interested")}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    ev.user_rsvp === "interested"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Interested</span>
                </button>

                <button
                  onClick={() => handleShareEvent(ev)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                  title="Share event"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {ev.mode === "online" && ev.location_or_link.startsWith("http") && (
                <a
                  href={ev.location_or_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-navy-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Video Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Host Event Modal */}
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
                  Host a Meetup or Webinar
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Pune Chapter Spring Reunion 2026"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as EventItem["category"])}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="city_meetup">City Meetup</option>
                      <option value="career_webinar">Career Webinar</option>
                      <option value="reunion">Batch Reunion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mode
                    </label>
                    <select
                      value={eventMode}
                      onChange={(e) => setEventMode(e.target.value as "online" | "offline")}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="offline">In-Person (Offline)</option>
                      <option value="online">Virtual (Online Link)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City / Hub
                    </label>
                    <input
                      type="text"
                      required
                      value={eventCity}
                      onChange={(e) => setEventCity(e.target.value)}
                      placeholder="e.g. Pune / Bengaluru"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location Address or Meet Link
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Cafe Bistro, FC Road, Pune or https://meet.google.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Agenda, refreshments, guidelines..."
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
                    Publish Gathering
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
