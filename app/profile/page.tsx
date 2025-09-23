"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");

  const [msgProfile, setMsgProfile] = useState<string | null>(null);
  const [msgEmail, setMsgEmail] = useState<string | null>(null);
  const [msgPwd, setMsgPwd] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setErr("Please sign in first.");
        setLoading(false);
        setTimeout(() => (window.location.href = "/sign-in"), 1000);
        return;
      }
      setEmail(user.email || "");
      setName(
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        ""
      );
      setLoading(false);
    })();
  }, []);

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setMsgProfile(null);
    setErr(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name || null },
    });
    if (error) return setErr(error.message);
    setMsgProfile("Name updated.");
  }

  async function updateEmail(e: React.FormEvent) {
    e.preventDefault();
    setMsgEmail(null);
    setErr(null);

    const siteUrl =
      (process.env.NEXT_PUBLIC_SITE_URL || "https://aptipilot.vercel.app").replace(/\/+$/, "");

    const { error } = await supabase.auth.updateUser({
      email: email.trim(),
      // Supabase will send a confirmation email to the new address
      // After confirm, the email changes and session stays valid
      // If you want to force re-login, handle in callback by `next=/profile`
    });
    if (error) return setErr(error.message);
    setMsgEmail("Check your new email address for a confirmation link.");
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsgPwd(null);
    setErr(null);
    if (pwd1.length < 6) return setErr("Password must be at least 6 characters.");
    if (pwd1 !== pwd2) return setErr("Passwords do not match.");
    const { error } = await supabase.auth.updateUser({ password: pwd1 });
    if (error) return setErr(error.message);
    // Keep them logged in
    await supabase.auth.refreshSession();
    setMsgPwd("Password changed.");
    setPwd1(""); setPwd2("");
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="mx-auto max-w-xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Your Profile</h1>

      {loading && <p>Loading…</p>}
      {!loading && err && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{err}</div>
      )}

      {!loading && !err && (
        <>
          {/* Name */}
          <section className="rounded-xl border p-4">
            <h2 className="mb-2 text-lg font-semibold">Name</h2>
            {msgProfile && <p className="mb-2 rounded border border-green-300 bg-green-50 p-2 text-green-700">{msgProfile}</p>}
            <form onSubmit={updateProfile} className="space-y-3">
              <input
                type="text"
                className="w-full rounded border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <button className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                Save name
              </button>
            </form>
          </section>

          {/* Email */}
          <section className="rounded-xl border p-4">
            <h2 className="mb-2 text-lg font-semibold">Email</h2>
            {msgEmail && <p className="mb-2 rounded border border-green-300 bg-green-50 p-2 text-green-700">{msgEmail}</p>}
            <form onSubmit={updateEmail} className="space-y-3">
              <input
                type="email"
                className="w-full rounded border px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <button className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                Change email
              </button>
            </form>
            <p className="mt-2 text-sm text-gray-600">
              You’ll receive a confirmation link at the new address.
            </p>
          </section>

          {/* Password */}
          <section className="rounded-xl border p-4">
            <h2 className="mb-2 text-lg font-semibold">Password</h2>
            {msgPwd && <p className="mb-2 rounded border border-green-300 bg-green-50 p-2 text-green-700">{msgPwd}</p>}
            <form onSubmit={updatePassword} className="space-y-3">
              <input
                type="password"
                className="w-full rounded border px-3 py-2"
                value={pwd1}
                onChange={(e) => setPwd1(e.target.value)}
                placeholder="New password"
                minLength={6}
                required
              />
              <input
                type="password"
                className="w-full rounded border px-3 py-2"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
                placeholder="Confirm password"
                minLength={6}
                required
              />
              <button className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                Change password
              </button>
            </form>
          </section>

          {/* Sign out */}
          <section className="rounded-xl border p-4">
            <h2 className="mb-2 text-lg font-semibold">Sign out</h2>
            <button
              onClick={signOut}
              className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Sign out
            </button>
          </section>
        </>
      )}
    </main>
  );
}
