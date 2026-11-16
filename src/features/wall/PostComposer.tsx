"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  BarChart2,
  Shield,
  Sparkles,
  Send,
  X,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { dataService } from "@/services/dataService";
import { Post } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PostComposerProps {
  onPostCreated: (post: Post) => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { playPop, playSuccess, playTap } = useSoundFX();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Post["category"]>("general");
  const [isSafeSpace, setIsSafeSpace] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      playTap();
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const next = [...pollOptions];
    next[idx] = val;
    setPollOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      if (!content.trim() && !showPollBuilder) {
        toast.error("Please write something to share with your fellow Navodayans.");
        return;
      }

      let pollData = undefined;
      if (showPollBuilder && pollQuestion.trim()) {
        const validOptions = pollOptions.filter((opt) => opt.trim().length > 0);
        if (validOptions.length >= 2) {
          pollData = {
            question: pollQuestion.trim(),
            options: validOptions.map((text) => ({ text, votes: [] })),
          };
        }
      }

      const post = dataService.createPost({
        content,
        category: isSafeSpace ? "safe_space" : category,
        is_safe_space: isSafeSpace,
        is_anonymous: isAnonymous,
        poll_data: pollData,
        media_urls: imageUrl ? [imageUrl] : [],
      });

      playSuccess();
      toast.success(
        isSafeSpace
          ? "Shared to The Real Talk (Safe Space) — protected for connections."
          : "Your post is now live across the network!"
      );

      // Reset
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
      setShowPollBuilder(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setIsSafeSpace(false);
      setIsAnonymous(false);

      onPostCreated(post);
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-sm transition-all">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            user?.avatar_url ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
          }
          alt={user?.full_name || "User"}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <textarea
            rows={content ? 3 : 2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isSafeSpace
                ? "Share a hurdle or personal truth in the Safe Space (visible to accepted connections only)..."
                : "Share a hostel memory, student achievement, or question for batchmates..."
            }
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none"
          />

          {/* Image Input Preview */}
          {showImageInput && (
            <div className="my-2 p-2 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setShowImageInput(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Interactive Poll Builder */}
          {showPollBuilder && (
            <div className="my-2 p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Build Poll (2 to 4 options)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPollBuilder(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a community question..."
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />

              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => handlePollOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              ))}

              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-xs font-semibold text-navy-700 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add another option</span>
                </button>
              )}
            </div>
          )}

          {/* Safe Space Mode Banner */}
          {isSafeSpace && (
            <div className="my-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Safe Space Mode: Comments disabled. Direct support only.</span>
              </div>
              <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-purple-600 rounded"
                />
                <span>Post Anonymously</span>
              </label>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              {/* Category Pills */}
              {!isSafeSpace && (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Post["category"])}
                  className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-lg border-none focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="memories">Hostel Memories</option>
                  <option value="achievements">Achievements</option>
                  <option value="campus_live">Campus Live</option>
                </select>
              )}

              {/* Attach Image */}
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setShowImageInput(!showImageInput);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showImageInput
                    ? "bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-blue-400"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
                title="Add Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Attach Poll */}
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setShowPollBuilder(!showPollBuilder);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showPollBuilder
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
                title="Create Poll"
              >
                <BarChart2 className="w-4 h-4" />
              </button>

              {/* Toggle Safe Space */}
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setIsSafeSpace(!isSafeSpace);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isSafeSpace
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100"
                }`}
                title="The Real Talk (Safe Space Mode)"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Safe Space</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="py-1.5 px-4 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
