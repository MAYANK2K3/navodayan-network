"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  ExternalLink,
  Phone,
  Tag,
  Plus,
  Search,
  MapPin,
  CheckCircle,
  Share2,
  Clock,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { BusinessListing } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function BusinessHubPage() {
  const { user, requireAuth } = useAuth();
  const { playTap, playPop, playSuccess } = useSoundFX();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // Form states for new business
  const [bizName, setBizName] = useState("");
  const [bizCategory, setBizCategory] = useState("Services & Consulting");
  const [bizDescription, setBizDescription] = useState("");
  const [bizWebsite, setBizWebsite] = useState("");
  const [bizWhatsapp, setBizWhatsapp] = useState(user?.whatsapp_number || "");
  const [bizOffer, setBizOffer] = useState("");
  const [bizCity, setBizCity] = useState(user?.current_city || "");

  const allBusinesses = dataService.getBusinesses(selectedCategory, false);
  const approvedBusinesses = allBusinesses.filter((b) => b.approved_status);
  const pendingBusinesses = allBusinesses.filter((b) => !b.approved_status);

  const filtered = approvedBusinesses.filter((b) => {
    const q = query.toLowerCase().trim();
    return (
      !q ||
      b.business_name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q)
    );
  });

  const handleListBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      dataService.createBusinessListing({
        business_name: bizName,
        category: bizCategory,
        description: bizDescription,
        website_url: bizWebsite,
        whatsapp_number: bizWhatsapp,
        navodayan_offer: bizOffer,
        city: bizCity,
      });

      playSuccess();
      toast.success("Business listing submitted! Verified and live on the network.");
      setIsListModalOpen(false);
      window.location.reload();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white border border-navy-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4" />
              <span>Buy From Navodayan Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Navodaya Business Hub
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Support ventures, consultancies, boutique stays, and agencies founded by Navodayans. Enjoy exclusive batchmate discounts across India and worldwide.
            </p>
          </div>

          <button
            onClick={() => {
              playTap();
              setIsListModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-amber-400 hover:bg-amber-300 active:scale-95 shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>List Your Business</span>
          </button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses, offers, or categories..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            playTap();
            setSelectedCategory(e.target.value);
          }}
          className="px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Business Sectors</option>
          <option value="Agritech">Agritech & Logistics</option>
          <option value="Hospitality">Travel & Stays</option>
          <option value="Academy">Education & Academies</option>
          <option value="FinTech">Finance & Advisory</option>
        </select>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((biz) => (
          <div
            key={biz.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Top Banner or Category */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-navy-50 dark:bg-navy-950 text-navy-800 dark:text-blue-300 border border-navy-200/60 dark:border-navy-800/60">
                  {biz.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{biz.city}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {biz.business_name}
              </h3>

              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Founded by{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {biz.owner_name}
                </span>{" "}
                ({biz.owner_school} • &apos;{biz.owner_batch})
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {biz.description}
              </p>

              {/* Exclusive Navodayan Offer Badge */}
              {biz.navodayan_offer && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 mb-4">
                  <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-snug">
                    {biz.navodayan_offer}
                  </p>
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${biz.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playTap}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>

                {biz.phone_number && (
                  <a
                    href={`tel:${biz.phone_number}`}
                    onClick={playTap}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-navy-700 dark:hover:text-blue-400 transition-colors"
                    title={`Call ${biz.phone_number}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>

              {biz.website_url && (
                <a
                  href={biz.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playTap}
                  className="flex items-center gap-1 text-xs font-semibold text-navy-700 dark:text-blue-400 hover:underline"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Admin Queue Notice */}
      {pendingBusinesses.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-zinc-900/50 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              {pendingBusinesses.length} business listing pending admin verification review.
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Automated Queue Active</span>
        </div>
      )}

      {/* List Business Modal */}
      <AnimatePresence>
        {isListModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  List Your Business or Agency
                </h3>
                <button
                  onClick={() => setIsListModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleListBusiness} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="e.g. Pine Ridge Homestays / Solvo Tech"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sector / Category
                    </label>
                    <input
                      type="text"
                      required
                      value={bizCategory}
                      onChange={(e) => setBizCategory(e.target.value)}
                      placeholder="e.g. Hospitality / Tech"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Operating City
                    </label>
                    <input
                      type="text"
                      required
                      value={bizCity}
                      onChange={(e) => setBizCity(e.target.value)}
                      placeholder="e.g. Bengaluru / Pune"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    What does your business do?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bizDescription}
                    onChange={(e) => setBizDescription(e.target.value)}
                    placeholder="Brief description of your products or services..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exclusive Navodayan Discount / Perk (Optional)
                  </label>
                  <input
                    type="text"
                    value={bizOffer}
                    onChange={(e) => setBizOffer(e.target.value)}
                    placeholder="e.g. Flat 20% discount for all verified alumni"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Contact
                    </label>
                    <input
                      type="tel"
                      required
                      value={bizWhatsapp}
                      onChange={(e) => setBizWhatsapp(e.target.value)}
                      placeholder="+91-9876543210"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={bizWebsite}
                      onChange={(e) => setBizWebsite(e.target.value)}
                      placeholder="https://mybiz.com"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsListModalOpen(false)}
                    className="w-1/2 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl"
                  >
                    Submit Listing
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
