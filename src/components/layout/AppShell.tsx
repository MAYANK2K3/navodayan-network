"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { SpotlightCommand } from "./SpotlightCommand";
import { DesktopSidebar } from "./DesktopSidebar";
import { RightWidgetRail } from "./RightWidgetRail";
import { MobileTabBar } from "./MobileTabBar";
import { MobileDrawer } from "./MobileDrawer";
import { Footer } from "./Footer";
import { AuthModal } from "@/components/modals/AuthModal";
import { OnboardingWizard } from "@/components/modals/OnboardingWizard";
import { FeedbackButton } from "@/features/feedback/FeedbackButton";
import { PostComposer } from "@/features/wall/PostComposer";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Fixed Apple-grade Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        isMobileDrawerOpen={isMobileDrawerOpen}
      />

      {/* Main Grid Container with Left & Right Rails */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex">
        {/* Left Sticky Navigation Rail */}
        <DesktopSidebar />

        {/* Central Dynamic Feed / Workspace */}
        <main className="flex-1 min-w-0 py-6 lg:px-4">{children}</main>

        {/* Right Sticky Contextual Widget Rail */}
        <RightWidgetRail />
      </div>

      {/* Global Footer */}
      <Footer />

      <FeedbackButton />

      {/* Mobile Sticky Bottom Tab Bar */}
      <MobileTabBar onQuickPost={() => setIsQuickPostOpen(true)} />

      {/* Spotlight Command Modal (Cmd+K) */}
      <SpotlightCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal />

      {/* Mandatory Onboarding Wizard */}
      <OnboardingWizard />

      {/* Mobile Quick Compose Modal */}
      <AnimatePresence>
        {isQuickPostOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Create Post or Memory
                </span>
                <button
                  onClick={() => setIsQuickPostOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PostComposer
                onPostCreated={() => {
                  setIsQuickPostOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
