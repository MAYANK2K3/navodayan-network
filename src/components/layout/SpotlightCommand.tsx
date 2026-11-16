"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  GraduationCap,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
  ShoppingBag,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { ALL_JNV_SCHOOLS } from "@/lib/seed/seed-schools";
import { DEMO_PROFILES } from "@/lib/seed/seed-demo";
import { ALL_CITIES_DATA } from "@/lib/seed/seed-cities";
import { APP_NAVIGATION } from "@/config/navigation";
import { useSoundFX } from "@/context/SoundContext";
import { motion, AnimatePresence } from "framer-motion";

interface SpotlightCommandProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpotlightCommand({ isOpen, onClose }: SpotlightCommandProps) {
  const router = useRouter();
  const { playTap, playPop } = useSoundFX();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onClose(); // toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search Results
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default recommended shortcuts
      return [
        { type: "nav", id: "schools", title: "Explore All 660+ JNV Schools", subtitle: "Directory by state and region", path: "/schools", icon: GraduationCap },
        { type: "nav", id: "map", title: "Navodayan Diaspora Map", subtitle: "Visual global city clusters", path: "/map", icon: MapPin },
        { type: "nav", id: "directory", title: "Alumni Directory & Blood Donors", subtitle: "Find batchmates & emergency donors", path: "/directory", icon: Users },
        { type: "nav", id: "mentorship", title: "Guidance & Mentorship Hub", subtitle: "UPSC, NEET, JEE & Tech advice", path: "/mentorship", icon: Compass },
        { type: "nav", id: "sos", title: "Emergency SOS Network", subtitle: "Active blood & medical requests", path: "/sos", icon: AlertTriangle },
      ];
    }

    const results: { type: string; id: string; title: string; subtitle: string; path: string; icon: React.ElementType }[] = [];

    // 1. Navigation items
    APP_NAVIGATION.forEach((nav) => {
      if (nav.name.toLowerCase().includes(q) || nav.description.toLowerCase().includes(q)) {
        results.push({
          type: "Feature",
          id: nav.id,
          title: nav.name,
          subtitle: nav.description,
          path: nav.path,
          icon: Sparkles,
        });
      }
    });

    // 2. Schools (Top 5 matches)
    const matchedSchools = ALL_JNV_SCHOOLS.filter(
      (s) =>
        s.school_name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    ).slice(0, 5);

    matchedSchools.forEach((s) => {
      results.push({
        type: "JNV School",
        id: s.id,
        title: s.school_name,
        subtitle: `${s.state} • ${s.region} Region • Est. ${s.established_year}`,
        path: `/schools/${s.slug}`,
        icon: GraduationCap,
      });
    });

    // 3. Alumni Profiles (Top 3)
    const matchedProfiles = DEMO_PROFILES.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.profession_role.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.current_city.toLowerCase().includes(q)
    ).slice(0, 3);

    matchedProfiles.forEach((p) => {
      results.push({
        type: "Alumni",
        id: p.id,
        title: p.full_name,
        subtitle: `${p.profession_role} @ ${p.organization} • ${p.jnv_school_name} ('${p.passing_year})`,
        path: `/directory?query=${encodeURIComponent(p.full_name)}`,
        icon: Users,
      });
    });

    // 4. Cities (Top 3)
    const matchedCities = ALL_CITIES_DATA.filter(
      (c) => c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 3);

    matchedCities.forEach((c) => {
      results.push({
        type: "City Cluster",
        id: `city-${c.city}`,
        title: `${c.city}, ${c.country}`,
        subtitle: `${c.alumni_count || 100}+ registered Navodayans in this cluster`,
        path: `/map?city=${encodeURIComponent(c.city)}`,
        icon: MapPin,
      });
    });

    return results.slice(0, 10);
  }, [query]);

  const handleSelect = (item: (typeof filteredResults)[0]) => {
    playPop();
    onClose();
    router.push(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      playTap();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      playTap();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 dark:border-white/10">
              <Search className="w-5 h-5 text-navy-700 dark:text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search by school, district, state, alumnus name, or city..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-zinc-800/60">
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No matches found for &quot;{query}&quot;. Try searching for &quot;Shimla&quot;, &quot;Gaya&quot;, or &quot;Bengaluru&quot;.
                </div>
              ) : (
                filteredResults.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-navy-50/80 dark:bg-navy-950/60 text-navy-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-navy-800 text-amber-400 shadow-sm"
                              : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">{item.title}</span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 shrink-0">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? "translate-x-1 text-navy-800 dark:text-blue-400" : "text-transparent"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Keyboard Hints */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-950/60 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded shadow-xs">
                    ↑↓
                  </kbd>{" "}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded shadow-xs">
                    ↵
                  </kbd>{" "}
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded shadow-xs">
                    ESC
                  </kbd>{" "}
                  Close
                </span>
              </div>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                The Navodayan Network
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
