"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  MapPin,
  ExternalLink,
  Mail,
  Phone,
  ArrowRight,
  Filter,
} from "lucide-react";
import { ALL_JNV_SCHOOLS } from "@/lib/seed/seed-schools";
import { useSoundFX } from "@/context/SoundContext";
import { NVSRegion } from "@/types";

export default function SchoolsDirectoryPage() {
  const { playTap } = useSoundFX();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [dualOnly, setDualOnly] = useState(false);

  // Extract unique regions & states
  const regions: NVSRegion[] = [
    "Bhopal",
    "Chandigarh",
    "Hyderabad",
    "Jaipur",
    "Lucknow",
    "Patna",
    "Pune",
    "Shillong",
  ];

  const states = useMemo(() => {
    const set = new Set<string>();
    ALL_JNV_SCHOOLS.forEach((s) => set.add(s.state));
    return Array.from(set).sort();
  }, []);

  const filteredSchools = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_JNV_SCHOOLS.filter((s) => {
      const matchQuery =
        !q ||
        s.school_name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.jnv_code.toLowerCase().includes(q);

      const matchRegion = selectedRegion === "all" || s.region === selectedRegion;
      const matchState = selectedState === "all" || s.state === selectedState;
      const matchDual = !dualOnly || !!s.is_dual_district;

      return matchQuery && matchRegion && matchState && matchDual;
    });
  }, [search, selectedRegion, selectedState, dualOnly]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>National Vidyalaya Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            660+ Jawahar Navodaya Vidyalayas
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Search any JNV across all 8 NVS Regions and Indian States. Access verified principal contacts, official NVS links, postal addresses, and registered batchmates.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by school name, district, state, or code (e.g. Shimla, HP-101)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* NVS Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => {
              playTap();
              setSelectedRegion(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
          >
            <option value="all">All 8 NVS Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r} Region
              </option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => {
              playTap();
              setSelectedState(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none max-w-[180px] truncate"
          >
            <option value="all">All States & UTs</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Dual JNV Only Toggle */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={dualOnly}
              onChange={(e) => setDualOnly(e.target.checked)}
              className="accent-navy-800 rounded"
            />
            <span>Dual-JNV Districts Only</span>
          </label>

          <div className="ml-auto text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
            Showing {filteredSchools.length} of {ALL_JNV_SCHOOLS.length} Vidyalayas
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchools.map((school) => (
          <div
            key={school.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 dark:bg-navy-950 text-navy-800 dark:text-blue-300 border border-navy-200/60 dark:border-navy-800/60">
                  {school.region} Region • {school.state_code}
                </span>

                {school.is_dual_district && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Dual District JNV
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {school.school_name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{school.district}, {school.state}</span>
                <span>•</span>
                <span>Est. {school.established_year}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {school.address}
              </p>
            </div>

            {/* Card Action Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${school.email}`}
                  onClick={playTap}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-navy-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  title={`Email ${school.email}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${school.phone_number}`}
                  onClick={playTap}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  title={`Call ${school.phone_number}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <Link
                href={`/schools/${school.slug}`}
                onClick={playTap}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-navy-800 dark:text-blue-300 bg-navy-50 dark:bg-navy-950/60 hover:bg-navy-100 transition-colors"
              >
                <span>Visit Campus Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
