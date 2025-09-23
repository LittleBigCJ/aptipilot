"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = not yet loaded

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!session?.user);
    }
    checkSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthed(!!session?.user);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  // Simple shimmer while loading auth state
  if (authed === null) {
    return (
      <nav className="w-full border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl justify-between p-4">
          <div className="h-6 w-24 bg-slate-100 rounded" />
          <div className="h-6 w-40 bg-slate-100 rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-slate-50 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link
          href="/"
          className="font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
        >
          AptiPilot
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/quiz"
            className="text-slate-700 hover:text-emerald-700 transition-colors"
          >
            Quiz
          </Link>

          {authed ? (
            <Link
              href="/profile"
              className="text-slate-700 hover:text-emerald-700 transition-colors"
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-slate-600 hover:text-emerald-700 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded bg-emerald-600 px-3 py-1.5 text-white font-medium
                           hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
