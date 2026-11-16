"use client";

import React, { useState } from "react";
import Link from "next/link";
import { JNVSchool, Post, NavodayanProfile } from "@/types";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import {
  GraduationCap,
  MapPin,
  ExternalLink,
  Mail,
  Phone,
  User,
  Clock,
  MessageSquare,
  Edit3,
  Users,
  CheckCircle,
  Share2,
} from "lucide-react";
import { PostCard } from "@/features/wall/PostCard";
import { PostComposer } from "@/features/wall/PostComposer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SchoolDetailClientProps {
  school: JNVSchool;
}

export default function SchoolDetailClient({ school }: SchoolDetailClientProps) {
  const { playTap, playPop, playSuccess } = useSoundFX();
  const { requireAuth } = useAuth();

  const [activeTab, setActiveTab] = useState<"feed" | "alumni" | "capsules">("feed");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateNotes, setUpdateNotes] = useState("");

  // Data for this school
  const schoolPosts = dataService.getPosts().filter((p) => p.school_id === school.id);
  const schoolAlumni = dataService.getProfiles({ schoolId: school.id });
  const schoolCapsules = dataService.getTimeCapsules(school.id);

  const handleSuggestUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      if (!updateNotes.trim()) return;
      playSuccess();
      toast.success("Thank you! Your information update suggestion has been submitted for verification.");
      setUpdateNotes("");
      setIsUpdateModalOpen(false);
    });
  };

  const handleShareCampus = () => {
    playPop();
    const text = encodeURIComponent(
      `🏛️ Join the official ${school.school_name} campus hub on The Navodayan Network! Connect with batchmates: https://navodayan.org/schools/${school.slug}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("WhatsApp share link opened!");
  };

  return (
    <div className="space-y-6">
      {/* Campus Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                {school.region} Region • Code: {school.jnv_code}
              </span>
              {school.is_dual_district && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Dual District Campus
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {school.school_name}
            </h1>

            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{school.district}, {school.state} • Established {school.established_year}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleShareCampus}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Campus Hub</span>
            </button>

            <button
              onClick={() => {
                playTap();
                setIsUpdateModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Suggest Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified School Contact & Directory Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Principal Info */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Principal & Leadership
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <User className="w-4 h-4 text-amber-500" />
            <span>{school.principal_name}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official NVS Head of Vidyalaya
          </div>
        </div>

        {/* Official Contacts */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Official Connectivity
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <a href={`mailto:${school.email}`} className="truncate hover:underline">
              {school.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <a href={`tel:${school.phone_number}`} className="hover:underline">
              {school.phone_number}
            </a>
          </div>
        </div>

        {/* NVS Portal & GPS */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Location & Verification
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
              {school.address}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400">
              GPS: {school.latitude.toFixed(2)}, {school.longitude.toFixed(2)}
            </span>
            <a
              href={school.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-700 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>NVS Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => {
            playTap();
            setActiveTab("feed");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "feed"
              ? "bg-navy-800 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Campus Feed ({schoolPosts.length})</span>
        </button>

        <button
          onClick={() => {
            playTap();
            setActiveTab("alumni");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "alumni"
              ? "bg-navy-800 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Batchwise Alumni ({schoolAlumni.length})</span>
        </button>

        <button
          onClick={() => {
            playTap();
            setActiveTab("capsules");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "capsules"
              ? "bg-navy-800 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Time Capsules ({schoolCapsules.length})</span>
        </button>
      </div>

      {/* Tab 1: Campus Feed */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          <PostComposer
            onPostCreated={() => {
              window.location.reload();
            }}
          />

          <div className="space-y-4">
            {schoolPosts.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10">
                <p className="text-xs text-slate-500">
                  No posts yet for {school.school_name}. Post the first update or hostel memory!
                </p>
              </div>
            ) : (
              schoolPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onPostUpdated={() => {
                    // updated
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Batchwise Alumni */}
      {activeTab === "alumni" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolAlumni.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10">
              <p className="text-xs text-slate-500">
                No alumni have claimed this campus yet. Share the invite link with your batchmates!
              </p>
            </div>
          ) : (
            schoolAlumni.map((alumnus) => (
              <div
                key={alumnus.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={alumnus.avatar_url}
                  alt={alumnus.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/80 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {alumnus.full_name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      {alumnus.navodayan_uid}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {alumnus.profession_role} @ {alumnus.organization}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Batch of {alumnus.passing_year} • {alumnus.current_city}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Time Capsules */}
      {activeTab === "capsules" && (
        <div className="space-y-4">
          {schoolCapsules.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10">
              <p className="text-xs text-slate-500">
                No time capsules sealed for this school yet. Visit the Time Capsule vault to create one!
              </p>
              <Link
                href="/capsules"
                className="inline-block mt-3 px-4 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl"
              >
                Create Batch Capsule
              </Link>
            </div>
          ) : (
            schoolCapsules.map((cap) => (
              <div
                key={cap.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Class of {cap.batch_year} Nostalgia Vault
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
                    {cap.is_unlocked ? "Unlocked" : "Locked Countdown"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {cap.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {cap.memories_json.dorm_stories[0]}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Suggest Info Update Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Suggest School Info Update
                </h3>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Notice an outdated principal name, wrong phone number, or updated campus location for {school.school_name}?
              </p>

              <form onSubmit={handleSuggestUpdate} className="space-y-3">
                <textarea
                  rows={4}
                  required
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Detail the corrections (e.g. New Principal: Dr. S. K. Gupta, Phone: +91-98...)"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl"
                  >
                    Submit for Review
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
