'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, MessageSquareText, Sparkles, X } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/services/dataService';
import type { PlatformFeedbackType } from '@/types';

const feedbackSchema = z.object({
  type: z.enum(['bug_report', 'feature_suggestion']),
  description: z.string().trim().min(10, 'Please provide at least 10 characters so the team can act on it.'),
  contact_whatsapp: z.string().trim().max(100).optional().or(z.literal('')),
  page_url: z.string().min(1),
});

function playSubmitChime() {
  if (typeof window === 'undefined') return;

  const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;

  const audioContext = new AudioCtor();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(980, audioContext.currentTime + 0.14);

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.24);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.24);
  oscillator.onended = () => {
    audioContext.close().catch(() => undefined);
  };
}

export function FeedbackButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<PlatformFeedbackType>('bug_report');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(user?.whatsapp_number || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://navodayan.org';
    return window.location.href;
  }, [isOpen]);

  useEffect(() => {
    setContact(user?.whatsapp_number || '');
  }, [user]);

  useEffect(() => {
    const openListener = () => setIsOpen(true);
    window.addEventListener('open-feedback-modal', openListener);
    return () => window.removeEventListener('open-feedback-modal', openListener);
  }, []);

  const resetForm = () => {
    setDescription('');
    setContact(user?.whatsapp_number || '');
    setError('');
    setType('bug_report');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validation = feedbackSchema.safeParse({
      type,
      description,
      contact_whatsapp: contact,
      page_url: pageUrl,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Please check your details and try again.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    dataService.submitPlatformFeedback({
      type,
      page_url: pageUrl,
      description: validation.data.description,
      contact_whatsapp: validation.data.contact_whatsapp || null,
      user_id: user?.id || null,
    });

    playSubmitChime();
    toast.success('Thank you! Your feedback has been sent to the core team.');
    setIsSubmitting(false);
    setIsOpen(false);
    resetForm();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-slate-900 text-white shadow-[0_18px_50px_rgba(15,23,42,0.35)] ring-1 ring-white/10 transition hover:scale-[1.02] hover:bg-slate-800 md:right-6 md:bottom-6 bottom-[calc(4.9rem+env(safe-area-inset-bottom))]"
        aria-label="Open feedback form"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-lg shadow-inner shadow-white/20">
          💡
        </span>
        <span className="hidden pr-4 text-sm font-semibold md:inline">Feedback / Report Bug</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/45 backdrop-blur-sm md:items-center"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="w-full max-w-xl rounded-t-[2rem] border border-white/30 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/80 md:rounded-[2rem]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Community Feedback
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    Help us improve the platform
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-slate-200"
                  aria-label="Close feedback form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 p-1.5 dark:bg-zinc-900/80">
                  {[
                    { value: 'bug_report', label: '🐞 Report an Error / Bug', icon: AlertTriangle },
                    { value: 'feature_suggestion', label: '✨ Suggest a Feature', icon: Sparkles },
                  ].map((option) => {
                    const Icon = option.icon;
                    const active = type === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setType(option.value as PlatformFeedbackType)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Current page
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <MessageSquareText className="h-4 w-4 text-emerald-500" />
                    <span className="truncate">{pageUrl}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback-description" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Tell us what happened or what you want to see
                  </label>
                  <textarea
                    id="feedback-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={6}
                    placeholder={
                      type === 'bug_report'
                        ? 'Example: On the schools page, the filter resets unexpectedly when I tap the state dropdown...'
                        : 'Example: It would help if the directory had a quick way to filter by batch year and current city...'
                    }
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100 dark:focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="feedback-contact" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    WhatsApp / contact (optional)
                  </label>
                  <input
                    id="feedback-contact"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-200/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100 dark:focus:ring-amber-500/20"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit feedback
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
