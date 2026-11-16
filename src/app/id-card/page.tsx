"use client";

import React from "react";
import { HolographicIDCard } from "@/components/id-card/HolographicIDCard";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import {
  CreditCard,
  Sparkles,
  Share2,
  ShieldCheck,
  QrCode,
  Users,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function IDCardPage() {
  const { user, openAuthModal, isAuthenticated } = useAuth();
  const { playPop, playSuccess } = useSoundFX();

  const handleBatchBlast = () => {
    playSuccess();
    const text = encodeURIComponent(
      `🎖️ Calling my JNV batchmates! Mint your official Unique Navodayan ID Card (${user?.navodayan_uid || "NVN-..."}) and join all 660+ schools on The Navodayan Network: https://navodayan.org`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("WhatsApp Batch Blast invite opened!");
    try {
      confetti({ particleCount: 100, spread: 70 });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Digital Credential Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Your Navodayan Digital ID Card
          </h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
            A permanent digital credential stamped with your state, passing year, and sequence. Flip in 3D to reveal emergency blood details and your batch QR verification.
          </p>
        </div>
      </div>

      {/* 3D Card Display */}
      {isAuthenticated && user ? (
        <div className="py-2">
          <HolographicIDCard profile={user} />
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Mint Your Unique Navodayan ID Card
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete the 60-second onboarding to receive your unique member sequence formatted as NVN-[STATE]-[YEAR]-[SEQ].
          </p>
          <button
            onClick={openAuthModal}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 shadow-md transition-all"
          >
            Sign In / Register Now
          </button>
        </div>
      )}

      {/* Viral Batch Blast Generator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            WhatsApp &quot;Batch Blast&quot; Invite Engine
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Reconnect with your old dormitory roommates, house captains, and batchmates. One tap shares your verified ID card and a direct invite to your school&apos;s digital hub.
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700 font-mono text-xs text-slate-700 dark:text-slate-300">
          &ldquo;🎖️ Calling all my batchmates! Mint your official Navodayan ID Card ({user?.navodayan_uid || "NVN-..."}) and connect across all 660+ schools: https://navodayan.org&rdquo;
        </div>

        <button
          onClick={handleBatchBlast}
          className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Send 1-Tap WhatsApp Batch Blast</span>
        </button>
      </div>
    </div>
  );
}
