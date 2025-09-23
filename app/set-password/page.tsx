"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SetPasswordPage() {
  const [loading, setLoading] = useState(true);
  const [canSet, setCanSet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setError("Please sign in via your email link first.");
      } else {
        setCanSet(true);
      }
      setLoading(false);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (pwd1.length < 6) return setError("Password must be at least 6 characters.");
    if (pwd1 !== pwd2) return setError("Passwords do not match.");

    const { error } = await supabase.auth.updateUser({ password: pwd1 });
    if (error) return setError(error.message);

    setMsg("Password set! You can now log in with email + password.");
    setPwd1(""); setPwd2("");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Set a password</h1>

      {loading && <p>Checking your session…</p>}

      {!loading && error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {!loading && canSet && (
        <form onSubmit={onSubmit} className="space-y-4">
          {msg && <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-green-700">{msg}</div>}

          <div>
            <label className="mb-1 block text-sm font-medium">New password</label>
            <input type="password" className="w-full rounded border px-3 py-2"
              value={pwd1} onChange={(e) => setPwd1(e.target.value)} minLength={6} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Confirm password</label>
            <input type="password" className="w-full rounded border px-3 py-2"
              value={pwd2} onChange={(e) => setPwd2(e.target.value)} minLength={6} required />
          </div>

          <button type="submit"
            className="w-full rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            Save password
          </button>

          <div className="text-sm mt-3">
            <a href="/quiz" className="text-blue-600 underline">Go to the Quiz</a>
          </div>
        </form>
      )}
    </main>
  );
}
