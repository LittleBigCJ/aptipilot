// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,      // e.g. https://xxxxx.supabase.co
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // anon public key
  {
    auth: {
      persistSession: true,       // ✅ keep session in localStorage across reloads
      autoRefreshToken: true,     // ✅ refresh tokens automatically
      detectSessionInUrl: true,   // ✅ handle magic-link callbacks
    },
  }
);
