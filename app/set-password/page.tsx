// app/set-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/quiz";

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session?.user) {
        router.replace("/sign-in?next=" + encodeURIComponent(next));
        return;
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [router, next]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (pwd.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (pwd !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) {
      setErr(error.message);
      return;
    }
    setOk("Password set! Redirecting…");
    // Give Supabase a tick to refresh local session
    setTimeout(() => router.replace(next), 600);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Set password</h1>
        <p className="text-gray-700">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-2">Set your password</h1>
      <p className="text-gray-700 mb-4">You can now set a password for password-based sign-in.</p>

      {err && <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">{err}</div>}
      {ok && <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-green-700">{ok}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">New password</label>
          <input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" minLength={6} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Confirm password</label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" minLength={6} className="w-full rounded border px-3 py-2" />
        </div>
        <button className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Set password</button>
      </form>
    </main>
  );
}
