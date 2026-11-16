"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  GraduationCap,
  Users,
  MapPin,
  Compass,
  ShoppingBag,
  AlertTriangle,
  Shield,
  Calendar,
  Clock,
  Award,
  MessageSquare,
  CreditCard,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  LogOut,
} from "lucide-react";
import { APP_NAVIGATION } from "@/config/navigation";
import { useSoundFX } from "@/context/SoundContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  GraduationCap,
  Users,
  MapPin,
  Compass,
  ShoppingBag,
  AlertTriangle,
  Shield,
  Calendar,
  Clock,
  Award,
  MessageSquare,
  CreditCard,
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { isMuted, toggleMute, playTap } = useSoundFX();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const navItems = APP_NAVIGATION.filter((item) => item.showInMobileDrawer);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-4/5 max-w-xs bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-navy-800 text-amber-400 font-serif font-black flex items-center justify-center text-sm shadow-xs">
                  JN
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Navodayan Super App
                </div>
              </div>
              <button
                onClick={() => {
                  playTap();
                  onClose();
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Bar or Login */}
            <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-200/80 dark:border-white/10">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {user.full_name}
                    </div>
                    <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold truncate">
                      {user.navodayan_uid}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {user.jnv_school_name}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal();
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In / Join Network</span>
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = ICON_MAP[item.iconName] || Globe;
                const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => {
                      playTap();
                      onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-navy-50 dark:bg-navy-950/80 text-navy-900 dark:text-white font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-amber-500"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer with Sound & Logout */}
            <div className="p-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={toggleMute}
                className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
                <span>{isMuted ? "Sound Off" : "Sound On"}</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-1 text-xs text-rose-600 p-2 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
