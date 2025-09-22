"use client";
import { supabase } from "@/utils/supabase/client";

export default function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/"; // or refresh
      }}
      className="rounded px-3 py-2 border"
    >
      Sign out
    </button>
  );
}