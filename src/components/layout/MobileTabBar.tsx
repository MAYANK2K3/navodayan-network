"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, GraduationCap, MapPin, Compass, CreditCard, Plus } from "lucide-react";
import { useSoundFX } from "@/context/SoundContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface MobileTabBarProps {
  onQuickPost: () => void;
}

export function MobileTabBar({ onQuickPost }: MobileTabBarProps) {
  const pathname = usePathname();
  const { playTap, playPop } = useSoundFX();
  const { isAuthenticated, openAuthModal } = useAuth();

  const tabs = [
    { name: "Feed", path: "/", icon: Globe },
    { name: "Schools", path: "/schools", icon: GraduationCap },
    { name: "Map", path: "/map", icon: MapPin },
    { name: "Guidance", path: "/mentorship", icon: Compass },
    { name: "ID Card", path: "/id-card", icon: CreditCard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-white/10 px-2 py-1.5 safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);

          // Center gap for Quick Action Button between index 1 and 2
          return (
            <React.Fragment key={tab.path}>
              {idx === 2 && (
                <button
                  onClick={() => {
                    playPop();
                    if (!isAuthenticated) {
                      openAuthModal();
                    } else {
                      onQuickPost();
                    }
                  }}
                  className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-navy-800 to-navy-600 text-amber-400 flex items-center justify-center shadow-lg shadow-navy-900/40 border-2 border-white dark:border-zinc-900 active:scale-90 transition-transform"
                  aria-label="Create Post or Alert"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
              )}

              <Link
                href={tab.path}
                onClick={playTap}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative min-h-[44px] transition-colors ${
                  isActive
                    ? "text-navy-800 dark:text-blue-400 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="mobileTabActive"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">{tab.name}</span>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
