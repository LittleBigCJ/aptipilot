// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser/client Supabase instance.
 * Uses the ANON (publishable) key only.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
