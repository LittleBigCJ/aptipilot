import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type SupabaseCookieAdapter = {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
};

export const createSupabaseServer = () => {
  const store = cookies();

  const cookieAdapter: SupabaseCookieAdapter = {
    // Use arrow functions to avoid the "getter" parsing issue
    get: (key) => {
      // Next may return a Cookie object or a string; normalize to string | undefined
      const c = (store as any).get(key);
      return typeof c === "string" ? c : c?.value;
    },
    set: (key, value, options) => {
      try {
        // In RSC cookies are read-only; this will throw (that’s fine).
        // @ts-expect-error - set is only available when cookies are mutable
        store.set({ name: key, value, ...options });
      } catch { /* no-op in RSC */ }
    },
    remove: (key, options) => {
      try {
        // @ts-expect-error - set is only available when cookies are mutable
        store.set({ name: key, value: "", ...options, maxAge: 0 });
      } catch { /* no-op in RSC */ }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
};
