"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function QuizPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!session?.user);
      setLoading(false);
    }
    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthed(!!session?.user);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Loading…</h1>
        <p className="text-gray-700">Checking your session.</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
        <p className="text-gray-700">
          You need to be signed in to access the quiz.{" "}
          <a href="/sign-in" className="text-blue-600 underline">Sign in</a>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Your Quiz</h1>
      {/* TODO: your quiz UI here */}
    </main>
  );
}
