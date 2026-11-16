"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  MapPin,
  Droplet,
  GraduationCap,
  Briefcase,
  MessageSquare,
  UserPlus,
  Check,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { BloodGroup, ProfessionCategory } from "@/types";
import { toast } from "sonner";

export default function MemberDirectoryPage() {
  const { user, requireAuth } = useAuth();
  const { playTap, playPop, playSuccess } = useSoundFX();

  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("all");
  const [bloodDonorsOnly, setBloodDonorsOnly] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const profiles = useMemo(() => {
    return dataService.getProfiles({
      query,
      city: selectedCity === "all" ? undefined : selectedCity,
      bloodGroup: selectedBloodGroup === "all" ? undefined : selectedBloodGroup,
      bloodDonorsOnly,
      profession: selectedProfession === "all" ? undefined : selectedProfession,
      passingYear: selectedYear === "all" ? undefined : Number(selectedYear),
    });
  }, [query, selectedCity, selectedBloodGroup, bloodDonorsOnly, selectedProfession, selectedYear]);

  const handleConnect = (targetUserId: string, targetName: string) => {
    requireAuth(() => {
      playSuccess();
      setConnectedUsers((prev) => [...prev, targetUserId]);
      toast.success(`Connection request sent to ${targetName}!`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Directory Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>National Alumni & Emergency Donor Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Find Your Navodayan Batchmates
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Search across 660+ schools by passing year, profession, current city, and verified emergency blood donor status.
          </p>
        </div>
      </div>

      {/* Multi-Filter Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, profession, company, or school..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Profession */}
          <select
            value={selectedProfession}
            onChange={(e) => {
              playTap();
              setSelectedProfession(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none truncate"
          >
            <option value="all">All Professions</option>
            <option value="IT & Software Engineering">IT & Software</option>
            <option value="Civil Services & Government (IAS/IPS/SSC/Banking)">Civil Services</option>
            <option value="Defence & Paramilitary (Army/Navy/Air Force/CAPF)">Defence Forces</option>
            <option value="Medical & Healthcare (Doctor/Surgeon/Pharma)">Medical / Doctors</option>
            <option value="Business, Startups & Entrepreneurship">Startups & Founders</option>
            <option value="Education, Research & JNV Faculty">Education & Faculty</option>
          </select>

          {/* Blood Group */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => {
              playTap();
              setSelectedBloodGroup(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none truncate"
          >
            <option value="all">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => {
              playTap();
              setSelectedCity(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none truncate"
          >
            <option value="all">All Cities</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi / NCR">Delhi / NCR</option>
            <option value="Pune">Pune</option>
            <option value="Lucknow">Lucknow</option>
            <option value="London">London (UK)</option>
            <option value="Guwahati">Guwahati</option>
          </select>

          {/* Passing Year */}
          <select
            value={selectedYear}
            onChange={(e) => {
              playTap();
              setSelectedYear(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium focus:outline-none truncate"
          >
            <option value="all">All Batches</option>
            {Array.from({ length: 30 }, (_, i) => 2025 - i).map((yr) => (
              <option key={yr} value={yr}>
                Batch of {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Blood Donors Only Toggle */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 cursor-pointer">
            <input
              type="checkbox"
              checked={bloodDonorsOnly}
              onChange={(e) => {
                playPop();
                setBloodDonorsOnly(e.target.checked);
              }}
              className="accent-rose-600 rounded w-4 h-4"
            />
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 fill-rose-600" />
              <span>Available Emergency Blood Donors Only</span>
            </span>
          </label>

          <div className="text-[11px] font-semibold text-slate-500">
            {profiles.length} Navodayans found
          </div>
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => {
          const isConnected = connectedUsers.includes(profile.id);

          return (
            <div
              key={profile.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {profile.full_name}
                      </h3>
                      {profile.is_blood_donor && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shrink-0">
                          <Droplet className="w-3 h-3 fill-rose-600" />
                          <span>{profile.blood_group} Donor</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {profile.navodayan_uid}
                    </div>

                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                      {profile.profession_role} @ {profile.organization}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.jnv_school_name} (&apos;{profile.passing_year})</span>
                    </div>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{profile.current_city}, {profile.current_country}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${profile.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playTap}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                    title="WhatsApp Message"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleConnect(profile.id, profile.full_name)}
                    disabled={isConnected}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isConnected
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-500 cursor-default"
                        : "bg-navy-800 hover:bg-navy-900 active:scale-95 text-white shadow-xs"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
