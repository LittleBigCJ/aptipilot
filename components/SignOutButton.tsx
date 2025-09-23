"use client";
import { createSupabaseBrowser } from "@/utils/supabase/client";

export default function SignOutButton() {
  const supabase = createSupabaseBrowser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // or use next/navigation's router.push("/")
  };

  return (
    <button onClick={handleSignOut} className="rounded px-3 py-2 border">
      Sign out
    </button>
  );
}
