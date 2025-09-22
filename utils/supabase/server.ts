// utils/supabase/server.ts
import { cookies as nextCookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createSupabaseServer() {
  // Next 15: cookies() is async. In older Next, awaiting a non-Promise is harmless.
  const store = await nextCookies();

  const safeSet = (name: string, value: string, options?: CookieOptions) => {
    try {
      // In RSC this may be read-only; .set exists in Server Actions / Route Handlers
      (store as any).set?.(name, value, options as any);
    } catch {
      /* ignore in read-only contexts */
    }
  };

  const safeDelete = (name: string) => {
    try {
      (store as any).delete?.(name);
    } catch {
      /* ignore in read-only contexts */
    }
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return store.get(name)?.value; // string | undefined
        },
        set(name: string, value: string, options?: CookieOptions) {
          safeSet(name, value, options);
        },
        remove(name: string, _options?: CookieOptions) {
          safeDelete(name);
        },
      },
    }
  );
}
