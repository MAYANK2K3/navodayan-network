import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-serif text-3xl font-black mb-6 shadow-md border border-amber-500/30">
        404
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
        Looks like this hostel room doesn&apos;t exist!
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        The Vidyalaya wing or alumni page you are looking for might have graduated or migrated. Let&apos;s guide you back to the assembly ground.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-navy-800 hover:bg-navy-900 shadow-md transition-all active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Return to Global Wall</span>
        </Link>

        <Link
          href="/schools"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-xs"
        >
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span>Browse 660+ Schools</span>
        </Link>
      </div>
    </div>
  );
}
