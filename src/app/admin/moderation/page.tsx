'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCheck, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import { dataService } from '@/services/dataService';
import type { PlatformFeedbackEntry, PlatformFeedbackStatus, PlatformFeedbackType } from '@/types';

const statusColors: Record<PlatformFeedbackStatus, string> = {
  new: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200',
  reviewed: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
};

const typeLabel: Record<PlatformFeedbackType, string> = {
  bug_report: 'Bug Report',
  feature_suggestion: 'Feature Suggestion',
};

export default function ModerationPage() {
  const [tab, setTab] = useState<'all' | PlatformFeedbackType>('all');
  const [entries, setEntries] = useState<PlatformFeedbackEntry[]>([]);

  useEffect(() => {
    setEntries(dataService.getPlatformFeedback());
  }, []);

  const filteredEntries = useMemo(() => {
    if (tab === 'all') return entries;
    return entries.filter((entry) => entry.type === tab);
  }, [entries, tab]);

  const updateStatus = (id: string, status: PlatformFeedbackStatus) => {
    dataService.updatePlatformFeedbackStatus(id, status);
    setEntries(dataService.getPlatformFeedback());
  };

  const summary = {
    total: entries.length,
    new: entries.filter((entry) => entry.status === 'new').length,
    reviewed: entries.filter((entry) => entry.status === 'reviewed').length,
    resolved: entries.filter((entry) => entry.status === 'resolved').length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Admin Moderation
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              User Feedback & Bugs
            </h1>
          </div>
          <div className="flex gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-zinc-700 dark:bg-zinc-900">
            {(['all', 'bug_report', 'feature_suggestion'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setTab(filter)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  tab === filter
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {filter === 'all'
                  ? 'All'
                  : filter === 'bug_report'
                    ? 'Bug Reports'
                    : 'Features'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{summary.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">New</p>
            <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-300">{summary.new}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Reviewed</p>
            <p className="mt-2 text-2xl font-bold text-sky-600 dark:text-sky-300">{summary.reviewed}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Resolved</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-300">{summary.resolved}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center text-slate-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-slate-300">
            No feedback has been submitted yet.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      entry.type === 'bug_report'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200'
                        : 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200'
                    }`}>
                      {entry.type === 'bug_report' ? <TriangleAlert className="mr-1 inline h-3.5 w-3.5" /> : <Sparkles className="mr-1 inline h-3.5 w-3.5" />}
                      {typeLabel[entry.type]}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColors[entry.status]}`}>
                      {entry.status}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{entry.description}</p>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <p>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Page:</span> {entry.page_url}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Contact:</span>{' '}
                      {entry.contact_whatsapp || 'Not provided'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Submitted:</span>{' '}
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-[180px] flex-col gap-2 md:items-end">
                  <button
                    type="button"
                    onClick={() => updateStatus(entry.id, 'reviewed')}
                    className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(entry.id, 'resolved')}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                  >
                    Mark Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(entry.id, 'new')}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                  >
                    Reset to New
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-300" />
          <p className="text-sm font-medium text-slate-100">
            Platform response is tracked in the demo store and can be replaced with live Supabase rows when connected.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
          <CheckCheck className="h-4 w-4 text-emerald-300" />
          <span>RLS is configured for guest insert and admin review in Supabase schema.</span>
        </div>
      </div>
    </div>
  );
}
