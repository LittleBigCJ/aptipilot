"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  // load auth state
  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!session?.user);
    }
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  // while loading auth state, reserve space to avoid flicker
  const authReady = authed !== null;

  const DesktopLinks = () => (
    <div className="hidden md:flex items-center gap-4">
      <Link href="/quiz" className="text-slate-700 hover:text-emerald-700 transition-colors">
        Quiz
      </Link>
      {authed ? (
        <Link href="/profile" className="text-slate-700 hover:text-emerald-700 transition-colors">
          Profile
        </Link>
      ) : (
        <>
          <Link href="/sign-in" className="text-slate-600 hover:text-emerald-700 transition-colors">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded bg-emerald-600 px-3 py-1.5 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );

  const MobileSheet = () => (
    <div
      className={`md:hidden ${open ? "block" : "hidden"} border-t border-slate-200 bg-white/95`}
      onClick={() => setOpen(false)}
    >
      <div className="mx-auto max-w-5xl p-4 flex flex-col gap-3">
        <Link href="/quiz" className="text-slate-700 hover:text-emerald-700 transition-colors">
          Quiz
        </Link>
        {authed ? (
          <Link href="/profile" className="text-slate-700 hover:text-emerald-700 transition-colors">
            Profile
          </Link>
        ) : (
          <>
            <Link href="/sign-in" className="text-slate-600 hover:text-emerald-700 transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded bg-emerald-600 px-3 py-2 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm inline-block w-full text-center"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <header className="w-full border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-slate-50 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold text-slate-800 hover:text-emerald-700 transition-colors">
          AptiPilot
        </Link>

        {/* Desktop */}
        {authReady ? <DesktopLinks /> : <div className="hidden md:block h-6 w-40" />}

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          {/* Simple icon (three bars / X) */}
          <svg
            className={`h-6 w-6 ${open ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg
            className={`h-6 w-6 ${open ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <div id="mobile-menu">
        {authReady ? <MobileSheet /> : null}
      </div>
    </header>
  );
}
