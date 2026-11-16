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
  HeartHandshake,
} from "lucide-react";
import { APP_NAVIGATION, NavigationItem } from "@/config/navigation";
import { useSoundFX } from "@/context/SoundContext";
import { motion } from "framer-motion";

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

export function DesktopSidebar() {
  const pathname = usePathname();
  const { playTap } = useSoundFX();

  const sidebarItems = APP_NAVIGATION.filter((item) => item.showInDesktopSidebar);

  return (
    <aside className="hidden lg:block w-64 shrink-0 py-6 pr-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
      <div className="space-y-6">
        {/* Core Nav Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Platform Hubs
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = ICON_MAP[item.iconName] || Globe;
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={playTap}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "text-navy-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  {/* Liquid Active Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 bg-navy-50/90 dark:bg-navy-950/70 border border-navy-200/80 dark:border-navy-800/80 rounded-xl -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === "SOS"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse"
                          : item.badge === "Live"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Community Pledge Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white shadow-md shadow-navy-950/20 border border-navy-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4" />
              <span>The Navodaya Code</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              No hostel houses. No regional divide. We shared the same mess, the same bell, and the same soil. Always lift a fellow Navodayan.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
