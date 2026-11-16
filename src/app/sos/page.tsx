"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Droplet,
  Phone,
  HeartHandshake,
  Plus,
  CheckCircle,
  Share2,
  Clock,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { EmergencySOS, BloodGroup } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencySOSPage() {
  const { user, requireAuth } = useAuth();
  const { playPop, playTap, playSuccess } = useSoundFX();

  const [activeFilter, setActiveFilter] = useState<"all" | "blood" | "active">("all");
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Form states
  const [sosTitle, setSosTitle] = useState("");
  const [sosDescription, setSosDescription] = useState("");
  const [sosType, setSosType] = useState<EmergencySOS["sos_type"]>("blood_medical");
  const [urgencyLevel, setUrgencyLevel] = useState<EmergencySOS["urgency_level"]>("critical");
  const [requiredBloodGroup, setRequiredBloodGroup] = useState<BloodGroup>("O-");
  const [targetCity, setTargetCity] = useState(user?.current_city || "Bengaluru");
  const [contactPhone, setContactPhone] = useState(user?.whatsapp_number || "");

  const alerts = dataService.getSOSAlerts();

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === "blood") return a.sos_type === "blood_medical";
    if (activeFilter === "active") return a.status === "active";
    return true;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      dataService.createSOS({
        title: sosTitle,
        description: sosDescription,
        sos_type: sosType,
        urgency_level: urgencyLevel,
        required_blood_group: sosType === "blood_medical" ? requiredBloodGroup : undefined,
        target_city: targetCity,
        contact_phone: contactPhone,
      });

      playSuccess();
      toast.success("Emergency SOS broadcasted across the Navodayan network!");
      setIsBroadcastModalOpen(false);
      setSosTitle("");
      setSosDescription("");
      window.location.reload();
    });
  };

  const handleOfferHelp = (alertId: string, title: string) => {
    requireAuth(() => {
      playSuccess();
      dataService.offerSOSHelp(alertId);
      toast.success(`Thank you for stepping up to help on "${title}"!`);
      window.location.reload();
    });
  };

  const handleShareSOS = (alert: EmergencySOS) => {
    playPop();
    const text = encodeURIComponent(
      `🚨 EMERGENCY SOS [${alert.urgency_level.toUpperCase()}]: ${alert.title} in ${alert.target_city}. Call: ${alert.contact_phone}. Verified on The Navodayan Network: https://navodayan.org/sos`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    toast.success("SOS share text generated for WhatsApp!");
  };

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-navy-950 text-white border border-rose-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>Priority Aid & Life Support Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Emergency SOS & Blood Match
            </h1>
            <p className="text-xs text-rose-100/90 max-w-xl mt-1 leading-relaxed">
              When a medical crisis strikes, Navodayans stand shoulder to shoulder. Instantly match available blood donors in any Indian city, coordinate accommodation, or emergency assistance.
            </p>
          </div>

          <button
            onClick={() => {
              playTap();
              setIsBroadcastModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-rose-600 hover:bg-rose-500 active:scale-95 shadow-lg shadow-rose-900/40 border border-rose-400/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Broadcast SOS Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            playTap();
            setActiveFilter("all");
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeFilter === "all"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
              : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          All Requests ({alerts.length})
        </button>

        <button
          onClick={() => {
            playTap();
            setActiveFilter("blood");
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeFilter === "blood"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-rose-600 dark:text-rose-400"
          }`}
        >
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>Blood Donation Matching</span>
        </button>

        <button
          onClick={() => {
            playTap();
            setActiveFilter("active");
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeFilter === "active"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          Active Only
        </button>
      </div>

      {/* SOS Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.urgency_level === "critical";

          // Find matching local blood donors if it's a blood request
          const matchingDonors =
            alert.sos_type === "blood_medical"
              ? dataService.getBloodDonors(alert.target_city, alert.required_blood_group)
              : [];

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-3xl border shadow-xs transition-all space-y-4 ${
                isCritical
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/50"
                  : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-white/10"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      isCritical
                        ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                        : "bg-amber-500/20 text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {alert.urgency_level}
                  </span>

                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alert.target_city}</span>
                  </span>

                  <span className="text-slate-300 dark:text-zinc-700">•</span>

                  <span className="text-xs text-slate-500">
                    Posted by {alert.author_name} ({alert.author_school})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <HeartHandshake className="w-4 h-4" />
                  <span>{alert.helpers_count} Navodayans responding</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug mb-1.5">
                  {alert.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {alert.description}
                </p>
              </div>

              {/* Automated Blood Matcher Box if Blood Request */}
              {alert.sos_type === "blood_medical" && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-rose-200 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      <Droplet className="w-4 h-4 fill-rose-600 text-rose-600" />
                      <span>
                        Automated Donor Match in {alert.target_city} ({alert.required_blood_group})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {matchingDonors.length} matching donors registered
                    </span>
                  </div>

                  {matchingDonors.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {matchingDonors.map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/30 text-xs"
                        >
                          <span className="font-bold text-slate-900 dark:text-white">
                            {d.full_name}
                          </span>
                          <span className="text-[10px] font-mono text-rose-600 font-bold">
                            {d.blood_group}
                          </span>
                          <a
                            href={`tel:${d.whatsapp_number}`}
                            className="p-1 text-rose-700 bg-white dark:bg-zinc-900 rounded-lg hover:bg-rose-100"
                            title="Call Donor"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No direct {alert.required_blood_group} donor listed in {alert.target_city} yet. Broadcasting alert to all regional alumni.
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${alert.contact_phone}`}
                    onClick={playTap}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-zinc-800 hover:bg-black transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Coordinator ({alert.contact_phone})</span>
                  </a>

                  <button
                    onClick={() => handleShareSOS(alert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Forward to WhatsApp</span>
                  </button>
                </div>

                <button
                  onClick={() => handleOfferHelp(alert.id, alert.title)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-sm transition-all"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>I Can Help 🤝</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast SOS Modal */}
      <AnimatePresence>
        {isBroadcastModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Broadcast Emergency SOS</span>
                </h3>
                <button
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={sosTitle}
                    onChange={(e) => setSosTitle(e.target.value)}
                    placeholder="e.g. Need 2 Units of O- Blood at Manipal Hospital"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Urgency Tier
                    </label>
                    <select
                      value={urgencyLevel}
                      onChange={(e) => setUrgencyLevel(e.target.value as EmergencySOS["urgency_level"])}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="critical">Critical 🔴 (Surgery / ICU)</option>
                      <option value="important">Important 🟡 (Accommodation)</option>
                      <option value="general">General 🟢 (City Help)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Request Type
                    </label>
                    <select
                      value={sosType}
                      onChange={(e) => setSosType(e.target.value as EmergencySOS["sos_type"])}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="blood_medical">Blood / Medical Emergency</option>
                      <option value="accommodation">Accommodation Aid</option>
                      <option value="city_help">Local City Help</option>
                      <option value="job_referral">Job Referral</option>
                    </select>
                  </div>
                </div>

                {sosType === "blood_medical" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Required Blood Group
                    </label>
                    <select
                      value={requiredBloodGroup}
                      onChange={(e) => setRequiredBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target City
                    </label>
                    <input
                      type="text"
                      required
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91-9876543210"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Emergency Details & Hospital Name
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={sosDescription}
                    onChange={(e) => setSosDescription(e.target.value)}
                    placeholder="Provide patient name, hospital wing, timeline, and exact requirements..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                  >
                    Broadcast Alert
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
