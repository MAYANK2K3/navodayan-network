"use client";

import React, { useState } from "react";
import {
  Compass,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  Sparkles,
  UserPlus,
  Send,
  HelpCircle,
  X,
  CheckCircle,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { MentorshipListing } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function MentorshipHubPage() {
  const { user, requireAuth } = useAuth();
  const { playTap, playPop, playSuccess } = useSoundFX();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedMentor, setSelectedMentor] = useState<MentorshipListing | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestTopic, setRequestTopic] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [isBecomeMentorOpen, setIsBecomeMentorOpen] = useState(false);
  const [mentorCategory, setMentorCategory] = useState<MentorshipListing["category"]>("work_life_corporate");
  const [mentorHeadline, setMentorHeadline] = useState("");
  const [mentorDescription, setMentorDescription] = useState("");
  const [mentorTags, setMentorTags] = useState("");

  const mentors = dataService.getMentors(activeCategory);

  const categoryStacks = [
    { id: "all", label: "All Stacks", icon: Compass },
    { id: "competitive_exams", label: "Competitive Exams (UPSC/NEET/JEE)", icon: BookOpen },
    { id: "higher_studies", label: "Higher Studies & Scholarships", icon: GraduationCap },
    { id: "business_startups", label: "Startups & Entrepreneurship", icon: Briefcase },
    { id: "work_life_corporate", label: "Work-Life & Corporate Growth", icon: Award },
  ];

  const handleOpenRequest = (mentor: MentorshipListing) => {
    requireAuth(() => {
      playTap();
      setSelectedMentor(mentor);
      setIsRequestModalOpen(true);
    });
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    dataService.requestMentorship(selectedMentor.id, requestTopic, requestMessage);
    playSuccess();
    toast.success(`Mentorship request sent to ${selectedMentor.mentor_name}! They will reach out via WhatsApp/email.`);
    setIsRequestModalOpen(false);
    setRequestTopic("");
    setRequestMessage("");
  };

  const handleRegisterMentor = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      const tags = mentorTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      dataService.createMentorListing({
        category: mentorCategory,
        headline: mentorHeadline,
        description: mentorDescription,
        expertise_tags: tags.length > 0 ? tags : ["Navodaya Guidance"],
        availability_note: "Available on weekends for 1-on-1 virtual sessions",
      });

      playSuccess();
      toast.success("Congratulations! You are now registered as an official Navodayan Mentor.");
      setIsBecomeMentorOpen(false);
      window.location.reload();
    });
  };

  return (
    <div className="space-y-6">
      {/* Mentorship Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Free 1-on-1 Guidance Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Guidance & Mentorship Hub
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Every successful senior remembers what it was like preparing from a rural district. Get 1-on-1 guidance for UPSC, NEET, JEE, tech interviews, and startup fundraising.
            </p>
          </div>

          <button
            onClick={() => {
              playTap();
              setIsBecomeMentorOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-amber-400 hover:bg-amber-300 active:scale-95 shadow-md transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Become a Mentor</span>
          </button>
        </div>
      </div>

      {/* 4 Category Stacks */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {categoryStacks.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                playTap();
                setActiveCategory(cat.id);
              }}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isActive
                  ? "bg-navy-900 text-white border-navy-700 shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-2 ${
                  isActive ? "text-amber-400" : "text-slate-400"
                }`}
              />
              <span className="text-xs font-bold leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mentor.mentor_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={mentor.mentor_name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {mentor.mentor_name}
                  </h3>
                  <div className="text-xs font-semibold text-navy-700 dark:text-blue-400 truncate">
                    {mentor.mentor_role} @ {mentor.mentor_org}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {mentor.mentor_school} • Batch of {mentor.mentor_batch}
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2">
                {mentor.headline}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-3">
                {mentor.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise_tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500 truncate pr-2">
                {mentor.availability_note || "1-on-1 virtual bridge"}
              </div>

              <button
                onClick={() => handleOpenRequest(mentor)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-white bg-navy-800 hover:bg-navy-900 active:scale-95 transition-all shadow-xs shrink-0"
              >
                <span>Request 1-on-1</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Mentorship Modal */}
      <AnimatePresence>
        {isRequestModalOpen && selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Request 1-on-1 Guidance
                  </h3>
                  <div className="text-xs text-amber-600 dark:text-amber-400">
                    With {selectedMentor.mentor_name}
                  </div>
                </div>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guidance Topic / Goal
                  </label>
                  <input
                    type="text"
                    required
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    placeholder="e.g. UPSC Mains Optional Strategy / Tech Mock Interview"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Current Stage & Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Share your background, what you've prepared so far, and the specific hurdles you need advice on..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Become a Mentor Modal */}
      <AnimatePresence>
        {isBecomeMentorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Register as a Navodayan Mentor
                </h3>
                <button
                  onClick={() => setIsBecomeMentorOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRegisterMentor} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guidance Domain Stack
                  </label>
                  <select
                    value={mentorCategory}
                    onChange={(e) => setMentorCategory(e.target.value as MentorshipListing["category"])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="competitive_exams">Competitive Exams (UPSC, NEET, JEE, CDS)</option>
                    <option value="higher_studies">Higher Studies & Scholarships</option>
                    <option value="business_startups">Business & Startups</option>
                    <option value="work_life_corporate">Work-Life & Corporate Careers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorHeadline}
                    onChange={(e) => setMentorHeadline(e.target.value)}
                    placeholder="e.g. Breaking into Tier-1 Tech / UPSC Answer Structuring"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    What can you help juniors with?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={mentorDescription}
                    onChange={(e) => setMentorDescription(e.target.value)}
                    placeholder="Describe your journey and what support you offer..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expertise Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={mentorTags}
                    onChange={(e) => setMentorTags(e.target.value)}
                    placeholder="System Design, FAANG, UPSC Prelims, MBA"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBecomeMentorOpen(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl"
                  >
                    Publish Listing
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
