import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type CookieAdapter = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
};

// What we minimally need from Next's cookies() in either RSC (read-only)
// or Route Handlers / Server Actions (mutable)
type MaybeCookies = {
  get: (name: string) => { value: string } | undefined;
  // set is only present when cookies are mutable (Route Handlers / Server Actions)
  set?: (args: { name: string; value: string } & CookieOptions) => void;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const createSupabaseServer = (): SupabaseClient => {
  // Normalize the cookies() object to our minimal interface without using `any`
  const raw = cookies();
  const store = raw as unknown as MaybeCookies;

  const adapter: CookieAdapter = {
    get: (name) => store.get(name)?.value,

    set: (name, value, options) => {
      try {
        // In RSC this is undefined; in mutable contexts it's available.
        store.set?.({ name, value, ...options });
      } catch {
        /* no-op in RSC */
      }
    },

    remove: (name, options) => {
      try {
        store.set?.({ name, value: "", ...options, maxAge: 0 });
      } catch {
        /* no-op in RSC */
      }
    },
  };

  return createServerClient(url, key, { cookies: adapter }) as unknown as SupabaseClient;
};
