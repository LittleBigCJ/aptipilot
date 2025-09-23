"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      setAuthed(!!user);
      setHydrated(true);
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

  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">AptiPilot</Link>

        {/* avoid flicker before we know auth state */}
        {!hydrated ? (
          <div className="h-6 w-40" />
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/quiz" className="hover:underline">Quiz</Link>

            {authed ? (
              // Signed in → show Profile only (no Sign in / Sign up / Sign out)
              <Link href="/profile" className="hover:underline">Profile</Link>
            ) : (
              // Signed out → show subtle Sign in and primary Sign up
              <>
                <Link href="/sign-in" className="text-gray-700 hover:underline">
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
