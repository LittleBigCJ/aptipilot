// utils/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * If you prefer having a single client, you can delete one of:
 * - lib/supabaseClient.ts  OR
 * - utils/supabase/client.ts
 * and update imports accordingly.
 */
export const supabase = createClient(url, anon);
