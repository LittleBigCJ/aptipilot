import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// note: caller will now `await getSupabaseServer()`
export async function getSupabaseServer() {
  const store = await cookies(); // <- await if typed as Promise<...>
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => store } // hand the store to Supabase
  );
}
