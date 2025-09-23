"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setAuthed(!!user);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s?.user));
    return () => { mounted = false; sub.subscription?.unsubscribe(); };
  }, []);

  const ready = authed !== null;

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="mt-3 rounded-2xl glass px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-[18px] font-semibold tracking-tight text-ink-900">
              AptiPilot
            </Link>

            {/* Desktop */}
            {ready ? (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/quiz" className="text-ink-700 hover:text-primary-700">Quiz</Link>
                {authed ? (
                  <Link href="/profile" className="text-ink-700 hover:text-primary-700">Profile</Link>
                ) : (
                  <>
                    <Link href="/sign-in" className="text-ink-600 hover:text-primary-700">Sign in</Link>
                    <Link href="/sign-up" className="btn-primary">Sign up</Link>
                  </>
                )}
              </div>
            ) : <div className="hidden md:block h-6 w-40" />}

            {/* Mobile button */}
            <button
              onClick={() => setOpen(s => !s)}
              className="md:hidden rounded-xl border border-white/60 bg-white/70 p-2 text-ink-700 shadow-soft"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {open
                  ? <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile sheet */}
          {ready && open && (
            <div className="md:hidden mt-3 border-t border-white/70 pt-3">
              <div className="flex flex-col gap-2">
                <Link href="/quiz" className="text-ink-700 hover:text-primary-700">Quiz</Link>
                {authed ? (
                  <Link href="/profile" className="text-ink-700 hover:text-primary-700">Profile</Link>
                ) : (
                  <>
                    <Link href="/sign-in" className="text-ink-600 hover:text-primary-700">Sign in</Link>
                    <Link href="/sign-up" className="btn-primary text-center">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
