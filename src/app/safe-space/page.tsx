"use client";

import React, { useState } from "react";
import { Shield, Lock, HeartHandshake, Sparkles, MessageCircle } from "lucide-react";
import { dataService } from "@/services/dataService";
import { PostCard } from "@/features/wall/PostCard";
import { PostComposer } from "@/features/wall/PostComposer";
import { Post } from "@/types";

export default function SafeSpacePage() {
  const [safePosts, setSafePosts] = useState<Post[]>(() =>
    dataService.getPosts("safe_space")
  );

  const handlePostCreated = (post: Post) => {
    setSafePosts((prev) => [post, ...prev]);
  };

  const handlePostUpdated = (updated: Post) => {
    setSafePosts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Safe Space Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-navy-950 text-white border border-purple-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Connection-Protected Circle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            The Real Talk (Safe Space)
          </h1>
          <p className="text-xs text-purple-100 max-w-xl mt-1 leading-relaxed">
            In competitive careers and big cities, it is easy to feel isolated. The Real Talk is an emotionally safe space to share burnouts, exam setbacks, and transition hurdles. Comments are disabled to prevent judgment; peer support is shared strictly via reactions and direct messages.
          </p>
        </div>
      </div>

      {/* Safety Protocol Card */}
      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex items-start gap-3">
        <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
          <span className="font-bold">Privacy Guaranteed:</span> All posts here can be shared anonymously (as &quot;A Fellow Navodayan&quot;). Database Row Level Security (RLS) ensures only verified Navodayans can view these reflections.
        </div>
      </div>

      {/* Safe Space Composer */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Posts Stream */}
      <div className="space-y-4">
        {safePosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdated={handlePostUpdated}
          />
        ))}
      </div>
    </div>
  );
}
